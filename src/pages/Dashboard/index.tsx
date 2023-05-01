import React, {useState} from "react";
import MyCard from "../../components/Card";
import {Grid, Box, Typography, Container} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface DashboardContentProp {
  content: string
  sx?: SxProps<Theme>
}

const amountCardStyle: SxProps<Theme> = {
  width: "100%",
  height: "7lh",
  border: "1px solid rgb(255,255,255, 0.6)",
  borderRadius: "8px",
  backgroundColor: "#0E111B",
}

const amountContentStyle: SxProps<Theme> = {
  paddingTop: 6,
  fontSize: "1.5rem"
}

const walletAmountCardStyle: SxProps<Theme> = {
  height: "15lh",
  border: "1px solid rgb(255,255,255, 0.6)",
  borderRadius: "8px",
  backgroundColor: "#0E111B",
}

const streamCardStyle: SxProps<Theme> = {
  width: "100%",
  height: "6lh",
  borderRadius: "8px",
  backgroundColor: "#0E111B",
}

const streamContentStyle: SxProps<Theme> = {
  paddingTop: 5,
  fontSize: "1.5rem"
}

const CardContent = ({content, sx}: DashboardContentProp) => {
  return (
    <Typography sx={sx}>
      {content}
    </Typography>
  )
}

const Dashboard = () => {
  const [canceledNum, setCanceledNum] = useState<number>(0);
  const [streamedNum, setStreamedNum] = useState<number>(0);
  const [completedNum, setCompletedNum] = useState<number>(0);
  const [scheduledNum, setScheduledNum] = useState<number>(0);
  const [outgoingNum, setOutgoingNum] = useState<number>(0);
  const [incomingNum, setIncomingNum] = useState<number>(0);
  const [incomingAmount, setIncomingAmount] = useState<number>(0);
  const [outgoingAmount, setOutgoingAmount] = useState<number>(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState<number>(0);
  const [addressNum, setAddressNum] = useState<number>(0);

  const amountCards = [
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center">
            <NorthEastIcon color="primary"/>
            <Typography variant="h6">Streaming / Outgoing</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          <CardContent content={`$${incomingAmount}`} sx={amountContentStyle}></CardContent>
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center">
            <NorthEastIcon color="primary"/>
            <Typography variant="h6">Streaming / Incoming</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          {<CardContent content={`$${outgoingAmount}`} sx={amountContentStyle}></CardContent>}
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center gap-x-1">
            <CurrencyExchangeIcon color="primary"/>
            <Typography variant="h6"> Withdrawable Amount</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          {<CardContent content={`$${withdrawnAmount}`} sx={amountContentStyle}></CardContent>}
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center gap-x-1">
            <AccountCircleOutlinedIcon htmlColor="#40187f"/>
            <Typography variant="h6"> Contracts in Address Book</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          {<CardContent content={`$${addressNum}`} sx={amountContentStyle}></CardContent>}
        </React.Fragment>,
    }
  ]
  const streamCards = [
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center">
            <SouthWestIcon color="info"/>
            <Typography variant="h6">Incoming</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          <CardContent content={`${incomingNum.toString()}`} sx={streamContentStyle}></CardContent>
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center">
            <NorthEastIcon color="primary"/>
            <Typography variant="h6">Outgoing</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          <CardContent content={`${outgoingNum.toString()}`} sx={streamContentStyle}></CardContent>
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center gap-x-1">
            <ScheduleIcon htmlColor="#40187f"/>
            <Typography variant="h6">Scheduled</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          <CardContent content={`${scheduledNum.toString()}`} sx={streamContentStyle}></CardContent>
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center gap-x-1">
            <CheckCircleOutlineRoundedIcon color="primary"/>
            <Typography variant="h6">Completed</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          <CardContent content={`${completedNum.toString()}`} sx={streamContentStyle}></CardContent>
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div  className="flex flex-row justify-start items-center">
            <AutorenewIcon color="primary"/>
            <Typography variant="h6">Streaming</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          <CardContent content={`${streamedNum.toString()}`} sx={streamContentStyle}></CardContent>
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div  className="flex flex-row justify-start items-center gap-x-1">
            <CancelOutlinedIcon htmlColor="#40187f"/>
            <Typography variant="h6">Canceled</Typography>
          </div>
        </React.Fragment>,
      content:
        <React.Fragment>
          <CardContent content={`${canceledNum.toString()}`} sx={streamContentStyle}></CardContent>
        </React.Fragment>,
    },
  ]

  return (
    <Box sx={{padding: 3}}>
      <Container sx={{marginTop: 5, height: "100%"}}>
        <Grid
          container
          spacing={3}
          direction="row"
        >
          <Grid item lg={4} md={12}>
            <Grid style={{height: "100%"}}>
              <Box sx={{height: "100%"}}>
                <MyCard
                  content={<CardContent content="content" sx={{paddingTop: 3, fontSize: "1.5rem"}}></CardContent>}
                  cardStyle={walletAmountCardStyle}
                >
                  <div className="flex flex-row justify-start items-center">
                    <AttachMoneyIcon color="primary"/>
                    <Typography variant="h6">Wallet Balance</Typography>
                  </div>

                </MyCard>
              </Box>
            </Grid>
          </Grid>
          <Grid item lg={8} md={12}>
            <Grid container spacing={3}>
              {amountCards.map((val) => {
                return (
                  <Grid item lg={6} md={12}>
                    <MyCard content={val.content} cardStyle={amountCardStyle}>
                      {val.title}
                    </MyCard>
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Box sx={{color: "#f143e2", marginTop: "1rem", marginBottom: "1rem"}}>
          <Typography variant="h5" color="white">Streams</Typography>
        </Box>
      </Container>
      <Container>
        <Grid container spacing={3}>
          {streamCards.map((val, idx) => {
            return (
              <Grid item lg={4} md={6} sm={12}>
                <MyCard content={val.content} cardStyle={streamCardStyle}>
                  {val.title}
                </MyCard>
              </Grid>
            )
          })}
        </Grid>
      </Container>

    </Box>
  )
}

export default Dashboard;