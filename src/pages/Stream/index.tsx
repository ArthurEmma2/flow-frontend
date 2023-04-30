import {
  Box,
  Collapse,
  Container,
  Grid,
  IconButton,
  Paper,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  Typography
} from "@mui/material";
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import GridViewIcon from '@mui/icons-material/GridView';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
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
import Item from "../../components/Item";

const tableStyle: SxProps<Theme> = {
  background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);",
  borderRadius: "8px",
  width: "100%",
}

const statusTab = [
  {name: "Scheduled", icon: <ScheduleIcon htmlColor="#40187f"/>},
  {name: "Streaming", icon: <AutorenewIcon color="primary"/>},
  {name: "Cancelled", icon: <CancelOutlinedIcon htmlColor="#40187f"/>},
  {name: "Paused", icon: <PauseCircleOutlinedIcon />},
  {name: "Completed", icon: <CheckCircleOutlineRoundedIcon color="primary"/>}
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
  const [totalNum, setTotalNum] = useState(0);

  const streamInfos: StreamInfo[] = [{
    coinId: "aptos",
    streamId: "1234",
    senderId: "u989489",
    recipientId: "joiaj",
    name: "demo stream",
    ratePerSecond: "10",
    startTime: "1682843609",
    stopTime: "1682943609",
    lastWithdrawTime: "0",
    depositAmount: "123000000",
    remainingBalance: "453000000",
    streamedAmount: "783000000",
    toTransfer: "0",
    interval: "193",
    status: "Streaming",
    toBeWithdrawal: "0",
    withdrawn: "0",
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
          <Box sx={{ width: '100%', border: "0px", borderRadius: "8px", paddingTop: 2, paddingBottom: 2, paddingLeft: 10, paddingRight: 10}}>
            <Typography variant="h6" component="div" align="center">
              Total Amount Streamed
            </Typography>
            <Typography variant="h6" align="center" component="div" sx={{marginTop: 1, marginBottom: 1, fontWeight: 'bolder', color: "#D5D5D5"}}>
              {row.name}
            </Typography>
            <Container>

              <div className="flex flex-row justify-between">
                <div>StartTime</div>
                <div>{moment(parseInt(row.startTime)).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>Streamed Amount</div>
                <div>
                  <div className="flex flex-row">
                    <p className="text-red-600 text-center">-</p>
                    <CountUp decimals={6} duration={1} end={Number(new BigNumber(row.streamedAmount).dividedBy(10 ** 9).toFixed(6))} />
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
                    <CountUp decimals={6} duration={1} end={Number(new BigNumber(row.toBeWithdrawal).dividedBy(10 ** 9).toFixed(6))} />
                  </div>
                </div>
              </div>
            </Container>


            {/*<Grid container spacing={2} sx={{ flexGrow: 1, paddingLeft: 6, paddingRight: 6 }}>*/}
            {/*  <Grid xs={0.25}></Grid>*/}
            {/*  <Grid xs={1.75}>*/}
            {/*    <Box sx={{ fontSize: '12pt', padding: 2, textAlign: "right"}}>*/}
            {/*      StartTime*/}
            {/*    </Box>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={3}>*/}
            {/*    <Box sx={{ fontSize: '12pt', padding: 2, textAlign: "right"}}>*/}
            {/*      {moment(parseInt(row.startTime)).format('YYYY-MM-DD HH:mm:ss')}*/}
            {/*    </Box>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={2}>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={2}>*/}
            {/*    <Box sx={{ fontSize: '12pt', padding: 2}}>Streamed Amount</Box>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={3}>*/}
            {/*    <Box sx={{ fontSize: '12pt', padding: 2}}>*/}
            {/*      <div className="flex flex-row">*/}
            {/*        <p className="text-red-600 text-center">-</p>*/}
            {/*        <CountUp decimals={6} duration={1} end={Number(new BigNumber(row.streamedAmount).dividedBy(10 ** 9).toFixed(6))} />*/}
            {/*      </div>*/}
            {/*    </Box>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={0.25}></Grid>*/}
            {/*  <Grid xs={1.75}>*/}
            {/*    <Box  sx={{ fontSize: '12pt', padding: 2, textAlign: "right"}}>*/}
            {/*      Stop Time*/}
            {/*    </Box>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={3}>*/}
            {/*    <Box sx={{ fontSize: '12pt', padding: 2, textAlign: "right"}}>*/}
            {/*      {moment(parseInt(row.stopTime)).format('YYYY-MM-DD HH:mm:ss')}*/}
            {/*    </Box>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={2}>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={2}>*/}
            {/*    <Box sx={{ fontSize: '12pt', padding: 2}}>Withdrawn Amount</Box>*/}
            {/*  </Grid>*/}
            {/*  <Grid xs={3}>*/}
            {/*    <Box sx={{fontSize: '12pt', padding: 2 }}>*/}
            {/*      <div className="flex flex-row align-middle text-center">*/}
            {/*        <p className="text-red-600 text-center">-</p>*/}
            {/*        <CountUp decimals={6} duration={1} end={Number(new BigNumber(row.toBeWithdrawal).dividedBy(10 ** 9).toFixed(6))} />*/}
            {/*      </div>*/}
            {/*    </Box>*/}
            {/*  </Grid>*/}
            {/*</Grid>*/}
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
            {row.name}
          </TableCell>
          <TableCell align="center">
            <div className="flex flex-row justify-center items-center">
              <p className="text-red-600 text-center">-</p>
              <div className="flex flex-row justify-center items-center">
                <CountUp
                  decimals={6}
                  duration={1}
                  end={Number(BigNumber.sum(row.withdrawn, row.toBeWithdrawal).dividedBy(10 ** 9).toFixed(6))}
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
      <Typography variant="h5" color="white">{`${streamType} Streams`}</Typography>
      <Paper sx={{ marginTop: 2, background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);"}}>
        <Tabs
          value={streamType}
          onChange={(event, newValue) => {setStreamType(newValue)}}
          aria-label="basic tabs example"
        >
          {streamTabs.map((val) => {
            return (
              <Tab key={val.name} label={val.name} value={val.name} icon={val.icon} iconPosition="start"/>
            )
          })}
        </Tabs>

        <Tabs
          value={statusType}
          onChange={(event, newValue) => {setStatusType(newValue)}}
          aria-label="basic tabs example"
        >
          <Tab label="All" value="All" icon={<GridViewIcon/>} iconPosition="start" />
          {statusTab.map((val) => {
            return (
              <Tab key={val.name} label={val.name} value={val.name} icon={val.icon} iconPosition="start"></Tab>
            )
          })}
        </Tabs>
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