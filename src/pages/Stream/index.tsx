import {
  Avatar,
  Box, Button,
  Collapse,
  Container,
  IconButton,
  Paper,
  Tab,
  TableCell,
  TableRow,
  Tabs, ToggleButton,
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
import GridViewIcon from '@mui/icons-material/GridView';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import React, {useState} from "react";
import StreamInfo from "../../types/streamInfo";
import MyTable from "../../components/Table";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import moment from 'moment';
import CountUp from 'react-countup';
import BigNumber from 'bignumber.js';
import {stringWithEllipsis} from "../../utils/string";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {AptosLogoAlt} from "../../resources";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { withStyles } from '@mui/styles';
import {Direction} from "../../types/streamStatus";

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
  {name: "All", icon: <GridViewIcon htmlColor="#FFFFFF" fontSize="small"/>},
  {name: "Scheduled", icon: <ScheduleIcon htmlColor="#40187f" fontSize="small"/>},
  {name: "Streaming", icon: <AutorenewIcon color="primary" fontSize="small"/>},
  {name: "Cancelled", icon: <CancelOutlinedIcon htmlColor="#40187f" fontSize="small"/>},
  {name: "Paused", icon: <PauseCircleOutlinedIcon fontSize="small"/>},
  {name: "Completed", icon: <CheckCircleOutlineRoundedIcon color="primary" fontSize="small"/>}
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
  const [streamType, setStreamType] = useState<string>("Outgoing");
  const [statusType, setStatusType] = useState("All");
  const [openMap, setOpenMap] = useState<Map<string, boolean>>(new Map<string, boolean>());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusMap, setStatusMap] = useState<Map<string, boolean>>(new Map([
    ["All", false],
    [Direction.Scheduled, false],
    [Direction.Streaming, false],
    [Direction.Canceled, false],
    [Direction.Paused, false],
    [Direction.Completed, false],
  ]))
  const [totalNum] = useState(0);

  const streamInfos: StreamInfo[] = [{
    // coinId: "aptos",
    closed: true,
    streamId: "1234",
    senderId: "u989489",
    recipientId: "joiaj",
    createTime: "1682843609",
    // name: "demo stream",
    ratePerInterval: "10",
    startTime: "1682843609",
    stopTime: "1682943609",
    lastWithdrawTime: "0",
    depositAmount: "123000000",
    remainingAmount: "453000000",
    // streamedAmount: "7.83000000",
    interval: "193",
    // toBeWithdrawal: "0",
    withdrawnAmount: "0",
  }]
  const columnList = ["Transaction Name", "Progress", "Transaction Date", "Recipient", "", "", "", ""]

  function changeCollapseButton(streamId: string) {
    const prevVal = openMap.get(streamId);
    const newMap = new Map(openMap)
    newMap.set(streamId, !prevVal);
    setOpenMap(newMap);
  }

  const CollapseContent = (props: {row: StreamInfo}) => {
    const {row} = props
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
                  {/*{row.streamedAmount}*/}
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
                <Button variant="outlined" style={{fontSize: 8, width: 120, height: 30, borderRadius: 8 }}>View on Explorer</Button>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between px-6 my-8">
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
                  <div>{row.senderId}</div>
                </div>

                <ContentCopyIcon width="2rem" height="2rem" fontSize="small"/>
              </Box>
              <Box sx={{flexShrink: 1}}>
                <CancelOutlinedIcon fontSize="small" />
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
                  <div>{row.recipientId}</div>
                </div>

                <ContentCopyIcon width="2rem" height="2rem" fontSize="small"/>
              </Box>
            </div>
            <Container>
              <div className="flex flex-row justify-between mb-4">
                <div>StartTime</div>
                <div>{moment(parseInt(row.startTime)).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>Streamed Amount</div>
                <div>
                  <div className="flex flex-row">
                    <p className="text-red-600 text-center">-</p>
                    {/*<CountUp decimals={6} duration={1} end={Number(new BigNumber(row.streamedAmount).dividedBy(10 ** 9).toFixed(6))} />*/}
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div>Stop Time</div>
                <div>{moment(parseInt(row.stopTime)).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>Withdrawn Amount</div>
                <div>
                  <div className="flex flex-row align-middle text-center">
                    <p className="text-red-600 text-center">-</p>
                    {/*<CountUp decimals={6} duration={1} end={Number(new BigNumber(row.toBeWithdrawal).dividedBy(10 ** 9).toFixed(6))} />*/}
                  </div>
                </div>
              </div>
            </Container>
          </Box>
        </Collapse>
      </React.Fragment>
    )
  }

  const Row = (props: {row: StreamInfo}) => {
    const {row} = props
    return (
      <React.Fragment>
        <TableRow key={row.streamId}>
          <TableCell align="center">
            {/*{row.name}*/}
          </TableCell>
          <TableCell align="center">
            <div className="flex flex-row justify-center items-center">
              <p className="text-red-600 text-center">-</p>
              <div className="flex flex-row justify-center items-center">
                <CountUp
                  decimals={6}
                  duration={1}
                  // end={Number(BigNumber.sum(row.withdrawn, row.toBeWithdrawal).dividedBy(10 ** 9).toFixed(6))}
                  end={0}
                />
                <div>/</div>
                <div>{Number(new BigNumber(row.depositAmount).dividedBy(10 ** 9).toFixed(6))}</div>
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
              {stringWithEllipsis(row.recipientId)}
              <ContentCopyIcon fontSize="small"/>
            </div>
          </TableCell>
          <TableCell align="center">
            <ShareIcon fontSize="small"/>
          </TableCell>
          <TableCell align="center">
            <PauseCircleOutlinedIcon fontSize="small"/>
          </TableCell>
          <TableCell align="center">
            <CancelOutlinedIcon fontSize="small"/>
          </TableCell>
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
            <CollapseContent row={row}/>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  return (
    <Container>
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
              statusMap.set(newVal, true)
              setStatusMap(statusMap);
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
                  // variant="outlined"
                  key={val.name}
                  value={val.name}
                  aria-label={val.name}
                  onClick={() => {

                }}>
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
          content={streamInfos}
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
          {streamInfos.length === 0 ? <></> : streamInfos.map((row) => {
            return (
              <Row row={row} key={row.streamId}></Row>
            )
          })}
        </MyTable>
      </Paper>
    </Container>
  )
}

export default Stream;