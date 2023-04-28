import React, {useState} from "react";
import MyCard from "../../components/Card";
import {Grid, Box, Typography, Paper, Container} from "@mui/material";


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
  return (
    <Box sx={{width: "100%", padding: 10}}>

      <Container sx={{marginTop: 5}}>
      <Grid container spacing={3}>
        <Grid item lg={4} >
          <Paper sx={{height: "100%"}}>
            <MyCard content="content">
              <Typography variant="h6">Wallet Balance</Typography>
            </MyCard>
          </Paper>

        </Grid>
        <Grid item lg={8}>
          <Grid container spacing={3}>
            <Grid item lg={6}>
              <MyCard content={`$${incomingAmount}`}>
                <Typography variant="h6">Streaming / Incoming</Typography>
              </MyCard>
            </Grid>
            <Grid item lg={6}>
              <MyCard content={`$${outgoingAmount}`}>
                <Typography variant="h6">Streaming / Outgoing</Typography>
              </MyCard>
            </Grid>
            <Grid item lg={6}>
              <MyCard content={`$${withdrawnAmount}`}>
                <Typography variant="h6">Withdrawn Amount</Typography>
              </MyCard>
            </Grid>
            <Grid item lg={6}>
              <MyCard content={`${addressNum}`}>
                <Typography variant="h6">Contracts in Address Book</Typography>
              </MyCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </Container>


      <Container sx={{marginTop: 5}}>
        <Grid container spacing={3}>
          <Grid item lg={4}>
            <MyCard content={incomingNum.toString()}>
              <Typography variant="h6">Incoming</Typography>
            </MyCard>
          </Grid>
          <Grid item lg={4}>
            <MyCard content={outgoingNum.toString()}>
              <Typography variant="h6">Outgoing</Typography>
            </MyCard>
          </Grid>
          <Grid item lg={4}>
            <MyCard content={scheduledNum.toString()}>
              <Typography variant="h6">Scheduled</Typography>
            </MyCard>
          </Grid>
          <Grid item lg={4}>
            <MyCard content={completedNum.toString()}>
              <Typography variant="h6">Completed</Typography>
            </MyCard>
          </Grid>
          <Grid item lg={4}>
            <MyCard content={streamedNum.toString()}>
              <Typography variant="h6">Streaming</Typography>
            </MyCard>
          </Grid>
          <Grid item lg={4}>
            <MyCard content={canceledNum.toString()}>
              <Typography variant="h6">Canceled</Typography>
            </MyCard>
          </Grid>
        </Grid>
      </Container>

    </Box>
  )
}

export default Dashboard;