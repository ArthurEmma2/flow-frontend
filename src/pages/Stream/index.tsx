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
  Typography
} from "@mui/material";
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ReplayIcon from '@mui/icons-material/Replay';
import GridViewIcon from '@mui/icons-material/GridView';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import React, {useContext, useEffect, useState} from "react";
import StreamInfo from "../../types/streamInfo";
import MyTable from "../../components/Table";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import moment from 'moment';
import CountUp from 'react-countup';
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
    icon: <SouthWestIcon color="info"/>
  },
  {
    name: "Incoming",
    icon: <NorthEastIcon color="primary"/>
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
  const [prevStreamedAmountMap, setPrevStreamedAmountMap] = useState<Map<string, string>>(new Map());
  const [withdrawableAmountMap, setWithdrawableAmountMap] = useState<Map<string, string>>(new Map());
  const [prevWithdrawableAmountMap, setPrevWithdrawableAmountMap] = useState<Map<string, string>>(new Map());
  const [streams, setStreams] = useState<StreamInfo[]>([]);
  const [streamType, setStreamType] = useState<string>("Outgoing");
  const [statusType, setStatusType] = useState("All");
  const [openMap, setOpenMap] = useState<Map<string, boolean>>(new Map<string, boolean>());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalNum] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState<string>("");

  const columnList = ["Transaction Name", "Progress", "Transaction Date", "Recipient", "", "", "", ""]

  function changeCollapseButton(streamId: string) {
    const prevVal = openMap.get(streamId);
    const newMap = new Map(openMap)
    newMap.set(streamId, !prevVal);
    setOpenMap(newMap);
  }

  const pullStreams = () => {
    if (streamType === "Outgoing") {
      walletAdapter?.getOutgoingStreams(accountAddr).then((streams: StreamInfo[]) => {
        if (statusType !== StreamStatus.All) {
          const newStreams =  streams.filter((stream) => {
            return stream.status === statusType;
          })
          setStreams(newStreams);
        } else {
          setStreams(streams);
        }
      })
    } else {
      walletAdapter?.getIncomingStreams(accountAddr).then((streams: StreamInfo[]) => {
          if (statusType !== StreamStatus.All) {
            const newStreams = streams.filter((stream) => {
              return stream.status === statusType;
            })
            setStreams(newStreams);
          } else {
            setStreams(streams);
          }
        }
      )
    }
  };

  const extendStreams = (extraAmount: number, row: StreamInfo) => {
    const newStopTime = Math.ceil((Number(row.stopTime) + extraAmount / ((Number(row.ratePerInterval) / 1000) / Number(row.interval))) / 1000);
    console.log('new StopTimes', newStopTime);
    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: 'entry_function_payload',
      function: `${netConfApt.contract}::stream::extend`,
      arguments: [
        newStopTime,
        row.streamId
      ],
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
    }
    signAndSubmitTransaction(transaction)
      .then((response) => {
        console.log("response", response);
      })
      .then(() => {
        setAlertStatus("success");
        setAlertMessage("The stream has been extended successfully.");
        setShowAlert(true);
      }).catch((e) => {
        setAlertStatus("failed");
        setAlertMessage(e.name);
      setShowAlert(true);
      })
  }

  const shouldDisable = (row: StreamInfo) : boolean => {
    console.debug("row: StreamInfo", row);
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
    console.log('resumeStreams', transaction);
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

  useEffect(() => {
    pullStreams()
  }, [chainName, network, accountAddr, connected, walletAdapter, streamType, statusType, alertMessage])

  // 定时更新streamedAmountMap
  useEffect(() => {
    // let interval = setInterval(() => {
      let currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
      let sMap = new Map();
      let wMap = new Map();
      setPrevWithdrawableAmountMap(withdrawableAmountMap);
      setPrevStreamedAmountMap(streamedAmountMap);
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
        sMap.set(streams[i].streamId, walletAdapter!.displayAmount(new BigNumber(streamedAmount)))
        const withdrawnAmount = walletAdapter!.calculateWithdrawableAmount(
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
        wMap.set(streams[i].streamId, walletAdapter!.displayAmount(new BigNumber(withdrawnAmount)));
      }
      console.log('sMap', wMap);
      setStreamedAmountMap(sMap);
      setWithdrawableAmountMap(wMap);
    // }, 10000);
    // return () => clearInterval(interval);
  }, [chainName, network, accountAddr, connected, walletAdapter, streamType, statusType, streams])

  const CollapseContent = (props: {
    row: StreamInfo,
    streamedAmount: number,
    prevStreamedAmount: number,
    withdrawableAmount: number,
    prevWithdrawableAmount: number,
  }) => {
    const {
      row,
      streamedAmount,
      prevStreamedAmount,
      withdrawableAmount,
      prevWithdrawableAmount,
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
                  <CountUp
                    decimals={6}
                    preserveValue
                    start={Number(new BigNumber(prevStreamedAmount).toFixed(6))}
                    end={Number(new BigNumber(streamedAmount).toFixed(6))}
                  />
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
                  style={{fontSize: 8, width: 120, height: 30, borderRadius: 8 }}
                  onClick={(e) => {
                    console.log('netword', network)
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
                }}>
                  <ContentCopyIcon width="2rem" height="2rem" fontSize="small"/>
                </IconButton>
              </Box>
              <Box >
                {
                  row.status === StreamStatus.Canceled && statusTab[3].icon
                }
                {
                  row.status === StreamStatus.Scheduled && statusTab[1].icon
                }
                {
                  row.status === StreamStatus.Completed && statusTab[5].icon
                }
                {
                  row.status === StreamStatus.Paused && statusTab[4].icon
                }
                {
                  row.status === StreamStatus.Streaming &&
                  <div className="streaming h-18">
                    <img src={require("../../resources/Streaming.gif")} alt="Streaming"  width="100%" height="50%"/>
                  </div>
                }
              </Box>
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
                    <p className="text-red-600 text-center">-</p>
                    <CountUp
                      decimals={6}
                      preserveValue
                      start={Number(new BigNumber(prevStreamedAmount).toFixed(6))}
                      end={Number(new BigNumber(streamedAmount).toFixed(6))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="shrink-0">Stop Time</div>
                <div className="shrink-0">{moment(parseInt(row.stopTime)).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div className="shrink">Withdrawable Amount</div>
                <div className="shrink-0">
                  <div className="flex flex-row align-middle text-center">
                    <p className="text-red-600 text-center">-</p>
                    <CountUp
                      decimals={6}
                      preserveValue
                      start={Number(new BigNumber(prevWithdrawableAmount).toFixed(6))}
                      end={Number(new BigNumber(withdrawableAmount).toFixed(6))}
                    />
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
    row: StreamInfo
  }) => {
    const {row} = props
    const [extendAnchorEl, setExtendAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [extendValue, setExtendValue] = useState<number>(0);
    const extendPopoverOpen = Boolean(extendAnchorEl);
    const id = extendPopoverOpen ? 'simple-popover' : undefined;
    const streamedAmount = streamedAmountMap.get(row.streamId)!
    const prevStreamedAmount = prevStreamedAmountMap.get(row.streamId)!
    const withdrawableAmount = withdrawableAmountMap.get(row.streamId)!
    const prevWithdrawableAmount = prevWithdrawableAmountMap.get(row.streamId)!
    if (row.streamId === "11") {
      console.log('j89829', streamedAmount)
      console.log('4893', prevStreamedAmount)
    }
    return (
      <React.Fragment>
        <TableRow key={row.streamId}>
          <TableCell align="center">
            {row.name}
          </TableCell>
          <TableCell align="center">
            <div className="flex flex-row justify-center items-center">
              <p className="text-red-600 text-center">-</p>
              <div className="flex flex-row justify-center items-center">
                <CountUp
                  decimals={6}
                  duration={3}
                  preserveValue
                  start={Number(new BigNumber(prevStreamedAmount).toFixed(6))}
                  end={Number(new BigNumber(streamedAmount).toFixed(6))}
                />
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
                }}>
                  <ContentCopyIcon fontSize="small"/>
                </IconButton>
              </div>
            </div>
          </TableCell>
          {
            streamType === "Outgoing" ? <>
              <TableCell align="center">
                <IconButton onClick={(event) => {setExtendAnchorEl(event.currentTarget)}} disabled={shouldDisable(row)}>
                  <ShareIcon fontSize="small"/>
                </IconButton>
                <Popover
                  id={id}
                  open={extendPopoverOpen}
                  anchorEl={extendAnchorEl}
                  onClose={() => {setExtendAnchorEl(null)}}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}

                >
                  <Box
                    component="form"
                    autoComplete="off"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: 2,
                      paddingRight: 2,
                      paddingBottom: 1,
                      paddingTop: 1,
                      borderRadius: "8px",
                      gap: 2
                    }}
                  >
                    <TextField id="standard-basic" label="Extend Amount" variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setExtendValue(Number(event.target.value) * 10**8)}}/>
                    <Button onClick={() => {extendStreams(extendValue, row)}}>Confirm</Button>
                  </Box>
                </Popover>
              </TableCell>
              <TableCell align="center">
                {row.status === StreamStatus.Paused ? <IconButton onClick={() => {resumeStreams(row.streamId)}}>
                  <MonetizationOnOutlinedIcon fontSize="small" />
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
                  <ReplayIcon fontSize="small"/>
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
              prevStreamedAmount={Number(prevStreamedAmount)}
              streamedAmount={Number(streamedAmount)}
              withdrawableAmount={Number(withdrawableAmount)}
              prevWithdrawableAmount={Number(prevWithdrawableAmount)}
            />
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  return (
    <Container>
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
          page={page}
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
                key={row.streamId}
                row={row}
              />
            )
          })}
        </MyTable>
      </Paper>
    </Container>
  )
}

export default Stream;