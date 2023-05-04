import React, {useContext, useEffect, useState} from "react";
import MyCard from "../../components/Card";
import {Box, Container, Grid, Typography} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {useWallet as useAptosWallet} from "@manahippo/aptos-wallet-adapter";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {WalletAdapter} from "../../context/WalletAdapter";
import BigNumber from "bignumber.js";
import {StreamStatus} from "../../types/streamStatus";

interface DashboardContentProp {
  content: string
  sx?: SxProps<Theme>
}

const amountCardStyle: SxProps<Theme> = {
  width: "100%",
  height: "9lh",
  border: "1px solid rgb(255,255,255, 0.6)",
  borderRadius: "8px",
  backgroundColor: "#0E111B",
}

const amountContentStyle: SxProps<Theme> = {
  paddingTop: 6,
  fontSize: "1.5rem"
}

const walletAmountCardStyle: SxProps<Theme> = {
  height: "19lh",
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
  const {  connected} = useAptosWallet();
  const {walletAdapter} = useContext(WalletAdapter);
  const accountAddr = walletAdapter?.getAddress()!;

  const [balance, setBalance] = useState<string>("0");
  const [canceledNum, setCanceledNum] = useState<number>(0);
  const [streamedNum, setStreamedNum] = useState<number>(0);
  const [completedNum, setCompletedNum] = useState<number>(0);
  const [scheduledNum, setScheduledNum] = useState<number>(0);
  const [outgoingNum, setOutgoingNum] = useState<number>(0);
  const [incomingNum, setIncomingNum] = useState<number>(0);
  const [incomingAmount, setIncomingAmount] = useState<number>(0);
  const [outgoingAmount, setOutgoingAmount] = useState<string>(0);
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

  useEffect(() => {
    if (connected) {
      walletAdapter?.getBalance().then((value) => {
        setBalance(value);
      })
    }
  }, [walletAdapter, connected])

  useEffect(() => {
    const interval = setInterval(() => {
      if(connected) {
        walletAdapter?.getBalance().then((balance) => {
          setBalance(balance);
        });

        walletAdapter?.getIncomingStreams(accountAddr).then((streams) => {
          setIncomingNum(streams.length);
          console.debug("getIncomingStreams", "streams", streams[0]);
          // const incomingSum = streams.reduce((acc, stream) => {
          //   return acc + BigInt(stream.depositAmount);
          // }, BigInt(0));
          //
          // const incomingSumH = toHumanAmount(incomingSum);
          // // console.debug("getIncomingStreams", "streams incoming sum", incomingSumH);
          // setIncomingSum(incomingSumH);
          //
          // const currTime = Date.parse(new Date().toString());
          //
          // const scheduledLenIn = streams.reduce((acc, stream) => {
          //   const startTime = Number(stream.startTime);
          //   const isScheduled = startTime > currTime ? 1 : 0;
          //   return acc + isScheduled;
          // }, 0);
          // setScheduledNum(scheduledLenIn);
          //
          // const completedLenIn = streams.reduce((acc, stream) => {
          //   const stopTime = Number(stream.stopTime);
          //   const paused = getNwField(stream.pauseInfo, network, "paused");
          //   const isCompleted = ( stopTime < currTime && !paused ) ? 1 : 0;
          //   return acc + isCompleted;
          // }, 0);
          // setCompletedNum(completedLenIn);
          //
          // const streamingLenIn = streams.reduce((acc, stream) => {
          //   const startTime = Number(stream.startTime);
          //   const stopTime = Number(stream.stopTime);
          //   const paused = getNwField(stream.pauseInfo, network, "paused");
          //   const _isStreaming = ( startTime <= currTime && stopTime >= currTime ) || ( stopTime < currTime && paused );
          //   const isStreaming = _isStreaming ? 1 : 0;
          //   return acc + isStreaming;
          // }, 0);
          // setStreamedNum(streamingLenIn);
          //
          // const canceledLenIn = streams.reduce((acc, stream) => {
          //   const isCanceled = stream.closed ? 1 : 0;
          //   return acc + isCanceled;
          // }, 0);
          // setCanceledNum(canceledLenIn);
          //
          // const incomingFluxSum = streams.reduce((acc, stream) => {
          //   const lastWithdrawnTime = Number(stream.lastWithdrawTime);
          //   const startTime = Number(stream.startTime);
          //   const stopTime = Number(stream.stopTime);
          //   const interval = Number(stream.interval);
          //   const paused = getNwField(stream.pauseInfo, network, "paused");
          //   const acc_pasued_time = Number(getNwField(stream.pauseInfo, network, "acc_pasued_time"));
          //   if (currTime <= startTime)
          //     return acc;
          //   else if (currTime >= startTime && currTime < lastWithdrawnTime)
          //     throw new Error('Current time should not be less than last withdrawn time');
          //   else if (currTime >= startTime && currTime >= lastWithdrawnTime && currTime <= stopTime) {
          //     if (paused)
          //       return acc + BigInt(stream.withdrawnAmount);
          //     else {
          //       const timeSpan = currTime - lastWithdrawnTime - acc_pasued_time;
          //       const intervalNum = Math.ceil(timeSpan / interval);
          //       const withdrawable = BigInt(intervalNum) * BigInt(stream.rate_per_interval) / BigInt(1000);
          //       // console.debug("getIncomingStreams", "paused == false", toHumanAmount(acc + BigInt(stream.withdrawn_amount) + withdrawable));
          //       return acc + BigInt(stream.withdrawn_amount) + withdrawable;
          //     }
          //   } else if (currTime > stopTime)
          //     if (paused)
          //       return acc + BigInt(stream.withdrawn_amount);
          //     else
          //       return acc + BigInt(stream.deposit_amount);
          // }, BigInt(0));
          // const incomingFluxSumH = toHumanAmount(incomingFluxSum);
          // // console.debug("getIncomingStreams", "streams incoming flux sum", incomingFluxSumH);
          // setIncomingAmount(incomingFluxSumH);
          //
          // const withdrawableSum = streams.reduce((acc, stream) => {
          //   const lastWithdrawnTime = Number(stream.last_withdraw_time);
          //   const startTime = Number(stream.start_time);
          //   const stopTime = Number(stream.stop_time);
          //   const interval = Number(stream.interval);
          //   const paused = getNwField(stream.pauseInfo, network, "paused");
          //   const acc_pasued_time = Number(getNwField(stream.pauseInfo, network, "acc_pasued_time"));
          //   if (currTime <= startTime)
          //     return acc;
          //   else if (currTime >= startTime && currTime < lastWithdrawnTime)
          //     throw new Error('Current time should not be less than last withdrawn time');
          //   else if (currTime >= startTime && currTime >= lastWithdrawnTime && currTime <= stopTime) {
          //     if (paused)
          //       return acc;
          //     else {
          //       const timeSpan = currTime - lastWithdrawnTime - acc_pasued_time;
          //       const intervalNum = Math.ceil(timeSpan / interval);
          //       const withdrawable = BigInt(intervalNum) * BigInt(stream.rate_per_interval) / BigInt(1000);
          //       // console.debug("getIncomingStreams", "withdrawable", "paused == false", toHumanAmount(acc + withdrawable));
          //       return acc + withdrawable;
          //     }
          //   } else if (currTime > stopTime)
          //     if (paused)
          //       return acc;
          //     else
          //       return acc + BigInt(stream.deposit_amount) - BigInt(stream.withdrawn_amount);
          // }, BigInt(0));
          // const withdrawableSumH = toHumanAmount(withdrawableSum);
          // // console.debug("getIncomingStreams", "withdrawable sum", withdrawableSumH);
          // setWithdrawableSum(withdrawableSumH);
        });

        walletAdapter?.getOutgoingStreams(accountAddr).then((streams) => {
          setOutgoingNum(streams.length);
          // console.debug("getOutgoingStreams", "streams", streams[0]);
          const outgoingSum = streams.reduce((acc, stream) => {
            return acc + Number(stream.depositAmount);
          }, 0);
          const outgoingSumH = walletAdapter?.displayAmount(new BigNumber(outgoingSum));
          // console.debug("getOutgoingStreams", "streams outgoing sum", outgoingSumH);
          setOutgoingAmount(outgoingSumH);


          const scheduledLenOut = streams.reduce((acc, stream) => {
            const isScheduled = stream.status === StreamStatus.Scheduled ? 1 : 0;
            return acc + isScheduled;
          }, 0);
          setScheduledNum(scheduledLenOut);

          const completedLenOut = streams.reduce((acc, stream) => {
            const isCompleted = stream.status === StreamStatus.Completed ? 1 : 0;
            return acc + isCompleted;
          }, 0);
          setCompletedNum(completedLenOut);

          const streamingLenOut = streams.reduce((acc, stream) => {
            const isStreaming = stream.status === StreamStatus.Streaming ? 1 : 0;
            return acc + isStreaming;
          }, 0);
          setStreamedNum(streamingLenOut);

          const canceledLenOut = streams.reduce((acc, stream) => {
            const isCanceled = stream.status === StreamStatus.Canceled ? 1 : 0;
            return acc + isCanceled;
          }, 0);
          setCanceledNum(canceledLenOut);

          const outgoingFluxSum = streams.reduce((acc, stream) => {
            const lastWithdrawnTime = Number(stream.lastWithdrawTime);
            const startTime = Number(stream.startTime);
            const stopTime = Number(stream.stopTime);
            const interval = Number(stream.interval);
            const paused = getNwField(stream.pauseInfo, network, "paused");
            const acc_pasued_time = Number(getNwField(stream.pauseInfo, network, "acc_pasued_time"));
            if (currTime <= startTime)
              return acc;
            else if (currTime >= startTime && currTime < lastWithdrawnTime)
              throw new Error('Current time should not be less than last withdrawn time');
            else if (currTime >= startTime && currTime >= lastWithdrawnTime && currTime <= stopTime) {
              if (paused)
                return acc + BigInt(stream.withdrawn_amount);
              else {
                const timeSpan = currTime - lastWithdrawnTime - acc_pasued_time;
                const intervalNum = Math.ceil(timeSpan / interval);
                const withdrawable = BigInt(intervalNum) * BigInt(stream.rate_per_interval) / BigInt(1000);
                // console.debug("getOutgoingStreams", "paused == false", toHumanAmount(acc + BigInt(stream.withdrawn_amount) + withdrawable));
                return acc + BigInt(stream.withdrawn_amount) + withdrawable;
              }
            } else if (currTime > stopTime)
              if (paused)
                return acc + BigInt(stream.withdrawn_amount);
              else
                return acc + BigInt(stream.deposit_amount);
          }, BigInt(0));

          const outgoingFluxSumH = toHumanAmount(outgoingFluxSum);
          // console.debug("getOutgoingStreams", "streams outgoing flux sum", outgoingFluxSumH);
          setOutgingFluxSum(outgoingFluxSumH);

          // adapter.getAddressBook(1, 1, account.address).then((addressBook) => {
          //   // console.debug(addressBook);
          //   setRecordsInAddrBook(addressBook.total);
          // });
        });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [accountAddr, connected, walletAdapter]);

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
                  content={<CardContent content={`$${balance}`} sx={{paddingTop: 3, fontSize: "1.5rem"}}></CardContent>}
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
              {amountCards.map((val, idx) => {
                return (
                  <Grid item lg={6} md={12} key={idx}>
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
              <Grid item lg={4} md={6} sm={12} key={idx}>
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