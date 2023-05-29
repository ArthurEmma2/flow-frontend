import {
  Alert,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  Paper,
  Popover,
  Snackbar,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Modal,
} from "@mui/material";
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import GridViewIcon from '@mui/icons-material/GridView';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import React, {useContext, useEffect, useState} from "react";
import StreamInfo from "../../types/streamInfo";
import MyTable from "../../components/Table";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import moment from 'moment';
import BigNumber from 'bignumber.js';
import {copyAddress, stringWithEllipsis} from "../../utils/string";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {AptosLogoAlt} from "../../resources";
import {Hashicon} from "@emeraldpay/hashicon-react";
import {withStyles} from '@mui/styles';
import {StreamStatus} from "../../types/streamStatus";
import {WalletAdapter} from "../../context/WalletAdapter";
import {ChainName} from "../../context/chainName";
import {Network} from "../../context/network";
import {useWallet as useAptosWallet} from "@manahippo/aptos-wallet-adapter/dist/WalletProviders/useWallet";
import {Types} from "aptos";
import netConfApt from "../../config/configuration.aptos";
// import Streaming from "resources/Streaming.gif";
import "./index.css";
import { useRef } from 'react';
import {gradientButtonStyle} from "../../style/button";
import Pagination from "../../types/pagination";

const customTypographyStyle = {
  h5: {
    color: "linear-gradient(103.84deg, #F143E2 -20.31%, #40187F 100%)"
  },
}

const CustomTypography = withStyles(customTypographyStyle)(Typography);

const tableStyle: SxProps<Theme> = {
  background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);",
  borderRadius: "8px",
  width: "100%",
}

const statusTab = [
  {name: StreamStatus.All, icon: <GridViewIcon htmlColor="#FFFFFF" fontSize="small"/>},
  {name: StreamStatus.Scheduled, icon: <ScheduleIcon htmlColor="#40187f" fontSize="small"/>},
  {name: StreamStatus.Streaming, icon: <AutorenewIcon color="primary" fontSize="small"/>},
  {name: StreamStatus.Canceled, icon: <CancelOutlinedIcon htmlColor="#40187f" fontSize="small"/>},
  {name: StreamStatus.Paused, icon: <PauseCircleOutlinedIcon fontSize="small"/>},
  {name: StreamStatus.Completed, icon: <CheckCircleOutlineRoundedIcon color="primary" fontSize="small"/>}
]

const streamTabs = [
  {
    name: "Outgoing",
    icon: <NorthEastIcon color="primary"/>
  },
  {
    name: "Incoming",
    icon: <SouthWestIcon color="info"/>
  }
]

const Stream = () => {
  const { signAndSubmitTransaction } = useAptosWallet();
  const {walletAdapter} = useContext(WalletAdapter);
  const {chainName} = useContext(ChainName);
  const {network} = useContext(Network);
  const { connected } = useAptosWallet();
  const accountAddr = walletAdapter?.getAddress()!;

  const [streamedAmountMap, setStreamedAmountMap] = useState<Map<string, string>>(new Map());
  const [withdrawableAmountMap, setWithdrawableAmountMap] = useState<Map<string, string>>(new Map());
  const [streams, setStreams] = useState<StreamInfo[]>([]);
  const [streamType, setStreamType] = useState<string>("Outgoing");
  const [statusType, setStatusType] = useState("All");
  const [openMap, setOpenMap] = useState<Map<string, boolean>>(new Map<string, boolean>());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalNum, setTotalNum] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState<string>("");
  const [openedPopoverId, setOpenedPopoverId] = useState<string | null>(null);
  const [extendAnchorEl, setExtendAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [iconPosition, setIconPosition] = useState<any>(null);
  const [popoverRow, setPopoverRow] = useState<StreamInfo | null>(null);
  const [extendValue, setExtendValue] = useState("0");
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [popStream, setPopStream] = useState<StreamInfo[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const columnList = ["Transaction Name", "Progress", "Transaction Date", "Recipient", "", "", "", ""]

  function changeCollapseButton(streamId: string) {
    const prevVal = openMap.get(streamId);
    const newMap = new Map(openMap)
    newMap.set(streamId, !prevVal);
    setOpenMap(newMap);
  }

  const tmpPagination = (newStreams: StreamInfo[]) => {
    const streamsLen = newStreams.length;
    // sort streams in descending date by field startTime
    newStreams = newStreams.sort((a, b) => Number(b.startTime) - Number(a.startTime));
    const index_start = (page - 1) * pageSize
    const index_end = (page * pageSize > streamsLen) ? streamsLen : (page * pageSize);
    return newStreams.slice(index_start, index_end);
  }

  const pullStreams = () => {
    let pagination: Pagination = {
      page: page - 1,
      pageSize: pageSize,
    }
    if (streamType === "Outgoing") {
      walletAdapter?.getOutgoingStreams(accountAddr, pagination).then(({streams, totalCount}) => {
        let newStreams: StreamInfo[];
        setTotalNum(totalCount);
        if (statusType !== StreamStatus.All) {
          newStreams =  streams.filter((stream) => {
            return stream.status === statusType;
          })
        } else {
          newStreams = streams;
        }

        newStreams = tmpPagination(newStreams);

        let sMap = getStreamedAmountMap(newStreams);
        setStreamedAmountMap(sMap);
        let wMap = getWithdrawableAmountMap(newStreams);
        console.log('newStreams', newStreams);
        setWithdrawableAmountMap(wMap);
        setStreams(newStreams);
        for(let i=0;i<newStreams.length;i++) {
          if(newStreams[i].senderId === openedPopoverId) {
            setPopoverRow(newStreams[i]);
            break;
          }
        }
      })
    } else {
      walletAdapter?.getIncomingStreams(accountAddr, pagination).then(({streams, totalCount}) => {
        let newStreams: StreamInfo[];
        setTotalNum(totalCount);
        if (statusType !== StreamStatus.All) {
          newStreams = streams.filter((stream) => {
            return stream.status === statusType;
          })
        } else {
          newStreams = streams;
        }

        newStreams = tmpPagination(newStreams);

        let sMap = getStreamedAmountMap(newStreams);
        setStreamedAmountMap(sMap);
        let wMap = getWithdrawableAmountMap(newStreams);
        setWithdrawableAmountMap(wMap);
        setStreams(newStreams);
        for(let i=0;i<newStreams.length;i++) {
          if(newStreams[i].senderId === openedPopoverId) {
            setPopoverRow(newStreams[i]);
            break;
          }
        }
      })
    }
  };

  const extendStreams = (extraAmount: string, row: StreamInfo) => {
    console.log('row___', row.name);
    console.log('extraAmount', extraAmount);
    console.log('ratePerInterval', row.ratePerInterval);
    console.log('interval', row.interval);
    // let tmp = Number(extraAmount) * (10 ** 8) / (Number(row.ratePerInterval) / 1000);
    let tmp = Math.ceil(Number(extraAmount) * (10 ** 8) / ((Number(row.ratePerInterval) / 1000) )) ;
    console.log('delta time', tmp);
    const newStopTime = Math.ceil((Number(row.stopTime) + tmp * Number(row.interval)) / 1000);
    console.log('new StopTimes', newStopTime);
    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: 'entry_function_payload',
      function: `${netConfApt.contract}::stream::extend`,
      arguments: [
        newStopTime,
        row.streamId
      ],
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
    };
    signAndSubmitTransaction(transaction)
      .then((response) => {
        console.log("response", response);
      })
      .then(() => {
        setAlertStatus("success");
        setAlertMessage("The stream has been extended successfully.");
        setShowAlert(true);
        handleModalClose();
      }).catch((e) => {
        setAlertStatus("failed");
        setAlertMessage(e.name);
        setShowAlert(true);
        handleModalClose();
      })
  }

  const shouldDisable = (row: StreamInfo) : boolean => {
    if (row.status === StreamStatus.Completed || row.status === StreamStatus.Paused || row.status === StreamStatus.Canceled)
      return true;
    else
      return false;
  }

  const pauseStreams = (streamId: string) => {
    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: 'entry_function_payload',
      function: `${netConfApt.contract}::stream::pause`,
      arguments: [
        streamId
      ],
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
    }
    signAndSubmitTransaction(transaction)
      .then((response) => {
        console.log("response", response);
      })
      .then(() => {
        setAlertStatus("success");
        setAlertMessage("The stream has been paused successfully.");
        setShowAlert(true);
      }).catch((e) => {
        setAlertStatus("failed");
        setAlertMessage(e.name);
        setShowAlert(true);
      })
  }

  const cancelStreams = (streamId: string) => {
    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: 'entry_function_payload',
      function: `${netConfApt.contract}::stream::close`,
      arguments: [
        streamId
      ],
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
    }
    signAndSubmitTransaction(transaction)
      .then((response) => {
        console.log("response", response);
      })
      .then(() => {
        setAlertStatus("success");
        setAlertMessage("The stream has been canceled successfully.");
        setShowAlert(true);
      }).catch((e) => {
        setAlertStatus("failed");
        setAlertMessage(e.name);
        setShowAlert(true);
      })
  }

  const withdrawStreams = (streamId: number) => {
    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: 'entry_function_payload',
      function: `${netConfApt.contract}::stream::withdraw`,
      arguments: [
        streamId
      ],
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
    }
    signAndSubmitTransaction(transaction)
      .then((response) => {
        console.log("response", response);
      })
      .then(() => {
        setAlertStatus("success");
        setAlertMessage("The stream has been withdrawn successfully.");
        setShowAlert(true);
      }).catch((e) => {
        setAlertStatus("failed");
        setAlertMessage(e.name);
        setShowAlert(true);
      })
  }

  const resumeStreams = (streamId: string) => {
    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: 'entry_function_payload',
      function: `${netConfApt.contract}::stream::resume`,
      arguments: [
        streamId
      ],
      type_arguments: [],
    }
    signAndSubmitTransaction(transaction)
      .then((response) => {
        console.log("response", response);
      })
      .then(() => {
        setAlertStatus("success");
        setAlertMessage("The stream has been resumed successfully.");
        setShowAlert(true);
      }).catch((e) => {
      setAlertStatus("failed");
      setAlertMessage(e.name);
      setShowAlert(true);
    })
  }

  const getWithdrawableAmountMap = (streams: StreamInfo[]): Map<string, string> => {
    let currTime = BigInt(Date.parse(new Date().toISOString().valueOf()));
    let wMap = new Map();
    for (let i = 0; i < streams.length; i++) {
      const withdrawableAmount = walletAdapter!.calculateWithdrawableAmount(
        Number(streams[i].startTime),
        Number(streams[i].stopTime),
        Number(currTime),
        Number(streams[i].pauseInfo.pauseAt),
        Number(streams[i].lastWithdrawTime),
        Number(streams[i].pauseInfo.accPausedTime),
        Number(streams[i].interval),
        Number(streams[i].ratePerInterval),
        streams[i].status,
      )
      wMap.set(streams[i].streamId, walletAdapter!.displayAmount(new BigNumber(withdrawableAmount)));
    }
    return wMap;
  }

  const getStreamedAmountMap = (streams: StreamInfo[]): Map<string, string> => {
    let currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    let sMap = new Map();
    for (let i = 0; i < streams.length; i++) {
      const streamedAmount = walletAdapter!.calculateStreamedAmount(
        Number(streams[i].withdrawnAmount),
        Number(streams[i].startTime),
        Number(streams[i].stopTime),
        Number(currTime),
        Number(streams[i].pauseInfo.pauseAt),
        Number(streams[i].lastWithdrawTime),
        Number(streams[i].pauseInfo.accPausedTime),
        Number(streams[i].interval),
        Number(streams[i].ratePerInterval),
        streams[i].status,
      );
      sMap.set(streams[i].streamId, streamedAmount)
    }
    return sMap;
  }

  useEffect(() => {
    pullStreams()
  }, [chainName, network, accountAddr, connected, walletAdapter, streamType, statusType, alertMessage, page, pageSize])

  // 定时更新streamedAmountMap
  useEffect(() => {
    let interval = setInterval(() => {
      let sMap = getStreamedAmountMap(streams);
      let wMap = getWithdrawableAmountMap(streams);
      setStreamedAmountMap(sMap);
      setWithdrawableAmountMap(wMap);
    }, 1000);
    return () => clearInterval(interval);
  }, [chainName, network, accountAddr, connected, walletAdapter, streamType, statusType, streams, page, pageSize]);

  const CollapseContent = (props: {
    row: StreamInfo,
    streamedAmount: number,
    withdrawableAmount: number,
  }) => {
    const {
      row,
      streamedAmount,
      withdrawableAmount,
    } = props

    return (
      <React.Fragment>
        <Collapse in={openMap.get(row.streamId)} timeout="auto" unmountOnExit>
          <Box sx={{ width: '100%', border: "0px", borderRadius: "8px", paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15}}>
            <Typography variant="h6" component="div" align="center">
              Total Amount Streamed
            </Typography>
            <div className="flex flex-row gap-x-1 items-center justify-end px-6">
              <div className="flex flex-row gap-x-1 items-center justify-center basis-1/3">
                <AptosLogoAlt fontSize="small" fill="#FFFFFF" width="2rem" height="2rem" />
                <Typography variant="h4" align="center" component="div" sx={{marginTop: 1, marginBottom: 1, fontWeight: 'bolder', color: "#D5D5D5"}}>
                  {Number(new BigNumber(streamedAmount).toFixed(6))}
                </Typography>
                <CustomTypography
                  variant="h5" align="center"
                  sx={{
                    marginTop: 1,
                    marginBottom: 1,
                    fontWeight: 'bolder',
                  }}
                >
                  Apt
                </CustomTypography>
              </div>
              <div className="flex basis-1/3 justify-end">
                <Button
                  variant="outlined"
                  style={{fontSize: 8, width: 130, height: 30, borderRadius: 8, whiteSpace: "nowrap", }}
                  onClick={(e) => {
                    window.open(`https://explorer.aptoslabs.com/account/${row.escrowAddress}?network=${network}`);
                  }}
                >View on Explorer</Button>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between px-6 my-8 gap-0">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1);",
                  width: "320px",
                  height: "72px",
                  paddingLeft: 3,
                  paddingRight: 3,
                }}
              >
                <div className="flex flex-row items-center justify-start gap-x-3">
                  <Avatar>
                    <Hashicon value={row.senderId} size={25}/>
                  </Avatar>
                  <div>{stringWithEllipsis(row.senderId)}</div>
                </div>
                <IconButton onClick={() => {
                  copyAddress(row.senderId);
                  setAlertMessage("Sender Address is Copied!")
                  setShowAlert(true);
                  setAlertStatus("success");
                }}>
                  <ContentCopyIcon width="2rem" height="2rem" fontSize="small"/>
                </IconButton>
              </Box>
              { row.status !== StreamStatus.Streaming ? <Box>
                {
                  row.status === StreamStatus.Canceled &&
                  <div className="px-2">
                    {statusTab[3].icon}
                  </div>
                }
                {
                  row.status === StreamStatus.Scheduled &&
                  <div className="px-2">
                    {statusTab[1].icon}
                  </div>
                }
                {
                  row.status === StreamStatus.Completed &&
                  <div className="px-2">
                    {statusTab[5].icon}
                  </div>
                }
                {
                  row.status === StreamStatus.Paused && <div className="px-2">
                    {statusTab[4].icon}
                  </div>
                }
              </Box>: <Box sx={{
                flexGrow: 1,
                flexShrink: 1,
              }}>
                <div>
                  <img src={require("../../resources/Streaming.gif")} alt="Streaming" className="animated-gif"/>
                </div>
              </Box>
              }
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1);",
                  width: "320px",
                  height: "72px",
                  paddingLeft: 3,
                  paddingRight: 3,
                }}
              >
                <div className="flex flex-row items-center justify-start gap-x-3">
                  <Avatar>
                    <Hashicon value={row.recipientId} size={25}/>
                  </Avatar>
                  <div>{stringWithEllipsis(row.recipientId)}</div>
                </div>
                <IconButton onClick={() => {
                  copyAddress(row.recipientId)
                  setAlertMessage("Recipient Address is Copied!")
                  setShowAlert(true);
                  setAlertStatus("success");
                }}>
                  <ContentCopyIcon width="2rem" height="2rem" fontSize="small"/>
                </IconButton>
              </Box>
            </div>
            <Container>
              <div className="flex flex-row justify-between mb-4">
                <div>Start Time</div>
                <div>{moment(parseInt(row.startTime)).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>Streamed Amount</div>
                <div>
                  <div className="flex flex-row">
                    {
                      streamType === "Outgoing" ? <p className="text-red-600 text-center">-</p> :
                        <p className="text-green-600 text-center">+</p>
                    }
                    {Number(new BigNumber(streamedAmount).toFixed(6))}
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="shrink-0">Stop Time</div>
                <div className="shrink-0">{moment(parseInt(row.stopTime)).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div className="shrink">Withdrawable Amount</div>
                <div className="shrink-0">
                  <div className="flex flex-row align-middle text-center">
                    {
                      streamType == "Outgoing" ? <p className="text-red-600 text-center">-</p> :
                        <p className="text-green-600 text-center">+</p>
                    }
                    {Number(new BigNumber(withdrawableAmount).toFixed(6))}
                  </div>
                </div>
              </div>
            </Container>
          </Box>
        </Collapse>
      </React.Fragment>
    )
  }

  const Row = (props: {
    row: StreamInfo,
    streamedAmountMap: Map<string, string>,
    withdrawableAmountMap: Map<string, string>,
  }) => {
    const {row, streamedAmountMap, withdrawableAmountMap} = props
    const streamedAmount = streamedAmountMap.get(row.streamId)!
    const withdrawableAmount = withdrawableAmountMap.get(row.streamId)!
    return (
      <React.Fragment>
        <TableRow key={row.streamId}>
          <TableCell align="center">
            {row.name}
          </TableCell>
          <TableCell align="center">
            <div className="flex flex-row justify-center items-center">
              {
                streamType === "Outgoing" ? <p className="text-red-600 text-center">-</p> : <p className="text-green-600 text-center">+</p>
              }
              <div className="flex flex-row justify-center items-center">
                <div>{Number(new BigNumber(streamedAmount).toFixed(6))}</div>
                <div>/</div>
                <div>{Number(new BigNumber(row.depositAmount).toFixed(6))}</div>
              </div>
            </div>
          </TableCell>
          <TableCell align="center">
            <div>
              <div>{`${moment(parseInt(row.startTime)).format('YYYY-MM-DD HH:mm:ss')}`}</div>
              <div>{`to ${moment(parseInt(row.stopTime)).format('YYYY-MM-DD HH:mm:ss')}`}</div>
            </div>
          </TableCell>
          <TableCell align="center">
            <div className="flex flex-row justify-center items-center gap-x-1">
              <div>
                {stringWithEllipsis(row.recipientId)}
              </div>
              <div>
                <IconButton onClick={() => {
                  copyAddress(row.recipientId)
                  setAlertMessage("Recipient Address is Copied!")
                  setShowAlert(true);
                  setAlertStatus("success");
                }}>
                  <ContentCopyIcon fontSize="small"/>
                </IconButton>
              </div>
            </div>
          </TableCell>
          {
            streamType === "Outgoing" ? <>
              <TableCell align="center">
                <IconButton onClick={(event) => {
                  // setExtendAnchorEl(event.currentTarget);
                  // setOpenedPopoverId(row.streamId);
                  // setIconPosition(event.currentTarget.getBoundingClientRect());
                  // setOpenPopover(true);
                  setPopStream([row]);
                  handleModalOpen();
                }} disabled={shouldDisable(row)}>
                  <ShareIcon fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell align="center">
                {row.status === StreamStatus.Paused ? <IconButton onClick={() => {resumeStreams(row.streamId)}}>
                  <PlayCircleOutlineIcon fontSize="small" />
                </IconButton> : <IconButton onClick={() => {pauseStreams(row.streamId)}} disabled={shouldDisable(row)}>
                  <PauseCircleOutlinedIcon fontSize="small"/>
                </IconButton>}
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => {cancelStreams(row.streamId)}} disabled={shouldDisable(row)}>
                  <CancelOutlinedIcon fontSize="small"/>
                </IconButton>
              </TableCell>
            </> : <>
              <TableCell>
                <IconButton onClick={() => {withdrawStreams(Number(row.streamId))}} disabled={shouldDisable(row)}>
                  <MonetizationOnOutlinedIcon fontSize="small"/>
                </IconButton>
              </TableCell>
            </>
          }
          <TableCell align="center">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                changeCollapseButton(row.streamId)
              }}
            >
              {openMap.get(row.streamId) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow sx={{bgcolor:"#1B2026"}}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <CollapseContent
              row={row}
              streamedAmount={Number(streamedAmount)}
              withdrawableAmount={Number(withdrawableAmount)}
            />
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  const handleModalOpen = () => {
    setOpenModal(true);
  }

  const handleModalClose = () => {
    setOpenModal(false);
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 510,
    bgcolor: '#313740',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: "20px",
  };

  const centerAnchorRef = useRef(null);
  return (
    <Container>
      <Box
          ref={centerAnchorRef}
          id="ttttt"
          sx={{
            position: 'fixed',
            top: "30%",
            left: "50%",
            zIndex: 100,
            height: "100px",
            width: "100px",
          }}

      >
      </Box>
      <Modal
        open={openModal}
        onClose={handleModalClose}
      >
        <Box sx={style}>
          <Typography
          sx={{
            color: "#fff",
          }}
          id="modal-modal-title" variant="h5" component="h2">
            Extend Amount
            <CloseIcon
              className="closeModalButton"
              sx={{
                float: "right",
                position: "relative",
                top:"5px"
              }}
              // sx={{position: "absolute", top: "10px", right: "10px", cursor: "pointer"}}
              onClick={handleModalClose}
            />
          </Typography>
          <TextField
              value={extendValue}
              onChange={(e) => setExtendValue(e.target.value)}
              style={{
                backgroundColor: "#313740",
                marginBottom: "0",
                marginTop: "15px",
                color: "white",
                height: "50px",
                borderRadius: "10px",
                lineHeight: "50px",
                width: "100%",
              }}
              // className="w-full bg-blue-200 text-sm rounded mb-4 p-2 input-field"
              label="Extend Amount"
           />
          {/*<Typography id="modal-modal-description" sx={{ color: "#C140B9",mt: 2, fontSize: "13px" }}>*/}
          {/*  You can top up between 0 and {0} APT*/}
          {/*</Typography>*/}
          <div className="flex mt-5 mb-2" style={{
            justifyContent: "flex-end",
            marginTop: "30px",
          }}>
              <Button
                size="small"
                sx={{
                  background: "#747474",
                  width: "80px",
                  height: "40px",
                  borderRadius: "10px",
                  marginRight: "30px",
                  color: "#E0E0E0"
                }}
                onClick={(e) => {
                  handleModalClose();
                    // handleSend();
                }
              }>Cancel</Button>
              <Button
                disabled={extendValue !== null && Number(extendValue) > 0 ? false : true}
                size="small" sx={{
                  ...gradientButtonStyle,
                  width: "80px",
                  height: "40px",
                  borderRadius: "10px",
                  // color: "#747474"
                }}
                onClick={(e) => {
                  // e.preventDefault();
                  extendStreams(extendValue, popStream[0]);
              }}>Confirm</Button>
            </div>
        </Box>
      </Modal>
      <Snackbar open={showAlert} autoHideDuration={4000} onClose={() => setShowAlert(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}} style={{marginTop: "50px"}}>
        { alertStatus === "success" ?
          <Alert onClose={() => setShowAlert(false)} severity="success">
            {alertMessage}
          </Alert> :
          <Alert onClose={() => setShowAlert(false)} severity="error">
            {alertMessage}
          </Alert>
        }
      </Snackbar>
      <Typography
        variant="h5"
        color="white"
        sx={{marginBottom: 2}}
      >
        {`${streamType} Streams`}
      </Typography>
      <Paper sx={{
        background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);"
      }}>
        <Tabs
          value={streamType}
          onChange={(event, newValue) => {setStreamType(newValue)}}
          aria-label="basic tabs example"
          sx={{ paddingLeft: 1, paddingRight: 1,}}
        >
          {streamTabs.map((val) => {
            return (
              <Tab key={val.name} label={val.name} value={val.name} icon={val.icon} iconPosition="end"/>
            )
          })}
        </Tabs>
        <Box sx={{ marginTop: 2, marginBottom: 2, paddingLeft: 2, paddingRight: 2 }}>
          <ToggleButtonGroup
            size="small"
            value={statusType}
            exclusive
            onChange={(e, newVal) => {
              setStatusType(newVal);
            }}
            aria-label="text alignment"
            sx={{
              gridGap: "1rem",
            }}
          >
            {statusTab.map((val) => {
              return (
                <ToggleButton
                  key={val.name}
                  value={val.name}
                  aria-label={val.name}
                >
                  <div className="flex flex-row items-center justify-center gap-x-1">
                    {val.name}
                    {val.icon}
                  </div>
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </Box>
        <MyTable
          content={streams}
          needPagination={true}
          availablePageSize={[5, 10, 15]}
          columnList={columnList}
          columnAlign="center"
          page={page-1}
          pageSize={pageSize}
          totalNum={totalNum}
          onPageChange={(event, newPage) => {
            console.log('newPage', newPage);
            setPage(newPage)
          }}
          onRowsPerPageChange={(event) => {
            setPageSize(parseInt(event.target.value, 10));
          }}
          tableSx={tableStyle}
        >
          {streams.length === 0 ? <></> : streams.map((row) => {
            return (
              <Row
                key={`${row.streamId}-${streamedAmountMap.get(row.streamId)}-${withdrawableAmountMap.get(row.streamId)}`}
                row={row}
                streamedAmountMap={streamedAmountMap}
                withdrawableAmountMap={withdrawableAmountMap}
              />
            )
          })}
        </MyTable>
      </Paper>
    </Container>
  )
}

export default Stream;
