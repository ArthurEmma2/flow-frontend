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
import StreamInfo from "../../types/streamInfo";
import {FindAddress} from "../../data/address";
import {ChainName} from "../../context/chainName";
import {Network} from "../../context/network";

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
  const {chainName} = useContext(ChainName);
  const {network} = useContext(Network);
  const accountAddr = walletAdapter?.getAddress()!;

  const [balance, setBalance] = useState<string>("0");
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
          {<CardContent content={`${addressNum}`} sx={amountContentStyle}></CardContent>}
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
        const currTime = Number(Date.parse(new Date().toString()));

        walletAdapter?.getBalance().then((balance) => {
          setBalance(balance);
        });

        walletAdapter?.getIncomingStreams(accountAddr).then((streams: StreamInfo[]) => {
          setIncomingNum(streams.length);
          console.debug("getIncomingStreams", "streams", streams[0]);
          const incomingSum = streams.reduce((acc, stream) => {
            return acc + Number(stream.depositAmount);
          }, 0);
          // console.debug("getIncomingStreams", "streams incoming sum", incomingSumH);
          setIncomingAmount(incomingSum);

          const scheduledLenIn = streams.reduce((acc, stream) => {
            const isScheduled = stream.status === StreamStatus.Scheduled ? 1 : 0;
            return acc + isScheduled;
          }, 0);
          setScheduledNum(scheduledLenIn);

          const completedLenIn = streams.reduce((acc, stream) => {
            const isCompleted = stream.status === StreamStatus.Completed ? 1 : 0;
            return acc + isCompleted;
          }, 0);
          setCompletedNum(completedLenIn);

          const streamingLenIn = streams.reduce((acc, stream) => {
            const startTime = Number(stream.startTime);
            const stopTime = Number(stream.stopTime);
            const paused = stream.status == StreamStatus.Paused;
            const _isStreaming = ( startTime <= currTime && stopTime >= currTime ) || ( stopTime < currTime && paused );
            const isStreaming = _isStreaming ? 1 : 0;
            return acc + isStreaming;
          }, 0);
          setStreamedNum(streamingLenIn);

          const canceledLenIn = streams.reduce((acc, stream) => {
            const isCanceled = stream.status === StreamStatus.Canceled ? 1 : 0;
            return acc + isCanceled;
          }, 0);
          setCanceledNum(canceledLenIn);

          const incomingFluxSum = streams.reduce((acc, stream) => {
            const lastWithdrawnTime = Number(stream.lastWithdrawTime);
            const startTime = Number(stream.startTime);
            const stopTime = Number(stream.stopTime);
            const interval = Number(stream.interval);
            const paused = stream.status === StreamStatus.Paused;
            const acc_paused_time = Number(stream.pauseInfo.accPausedTime);
            if (currTime <= startTime) {
              return acc;
            }
            else if (currTime >= startTime && currTime < lastWithdrawnTime) {
              return Number(0);
            } else if (currTime >= startTime && currTime >= lastWithdrawnTime && currTime <= stopTime) {
              if (paused) {
                return acc + Number(stream.withdrawnAmount);
              } else {
                const timeSpan = currTime - lastWithdrawnTime - acc_paused_time;
                const intervalNum = Math.ceil(timeSpan / interval);
                const withdrawable = Number(BigInt(intervalNum) * BigInt(stream.ratePerInterval) / BigInt(1000));
                // console.debug("getIncomingStreams", "paused == false", toHumanAmount(acc + BigInt(stream.withdrawn_amount) + withdrawable));
                return acc + Number(stream.withdrawnAmount) + withdrawable;
              }
            } else if (currTime > stopTime) {
              if (paused) {
                return acc + Number(stream.withdrawnAmount);
              }
              return acc + Number(stream.depositAmount);
            }
            return 0;
          }, 0);
          // console.debug("getIncomingStreams", "streams incoming flux sum", incomingFluxSumH);
          setIncomingAmount(incomingFluxSum);

          const withdrawableSum = streams.reduce((acc, stream) => {
            const lastWithdrawnTime = Number(stream.lastWithdrawTime);
            const startTime = Number(stream.startTime);
            const stopTime = Number(stream.stopTime);
            const interval = Number(stream.interval);
            const paused = stream.status === StreamStatus.Paused;
            const acc_paused_time = Number(stream.pauseInfo.accPausedTime);
            if (currTime <= startTime) {
              return acc;
            } else if (currTime >= startTime && currTime < lastWithdrawnTime) {
              throw new Error('Current time should not be less than last withdrawn time');
            } else if (currTime >= startTime && currTime >= lastWithdrawnTime && currTime <= stopTime) {
              if (paused) {
                return acc;
              } else {
                const timeSpan = currTime - lastWithdrawnTime - acc_paused_time;
                const intervalNum = Math.ceil(timeSpan / interval);
                const withdrawable = Number(BigInt(intervalNum) * BigInt(stream.ratePerInterval) / BigInt(1000));
                // console.debug("getIncomingStreams", "withdrawable", "paused == false", toHumanAmount(acc + withdrawable));
                return acc + Number(withdrawable);
              }
            } else if (currTime > stopTime) {
              return paused ? acc : acc + Number(stream.depositAmount) - Number(stream.withdrawnAmount);
            }
            return 0;
          }, 0);
          // console.debug("getIncomingStreams", "withdrawable sum", withdrawableSumH);
          setWithdrawnAmount(withdrawableSum);
        });

        walletAdapter?.getOutgoingStreams(accountAddr).then((streams) => {
          setOutgoingNum(streams.length);
          // console.debug("getOutgoingStreams", "streams", streams[0]);
          const outgoingSum = streams.reduce((acc, stream) => {
            return acc + Number(stream.depositAmount);
          }, 0);
          const outgoingSumH = walletAdapter?.displayAmount(new BigNumber(outgoingSum));
          // console.debug("getOutgoingStreams", "streams outgoing sum", outgoingSumH);
          setOutgoingAmount(Number(outgoingSumH));

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

          const outgoingAmount = streams.reduce((acc: number, stream: StreamInfo) => {
            const lastWithdrawnTime = Number(stream.lastWithdrawTime);
            const startTime = Number(stream.startTime);
            const stopTime = Number(stream.stopTime);
            const interval = Number(stream.interval);
            const paused = stream.status === StreamStatus.Paused;
            const acc_paused_time = Number(stream.pauseInfo.accPausedTime);

            if (currTime <= startTime) {
              return Number(acc);
            } else if (currTime >= startTime && currTime < lastWithdrawnTime) {
              return Number(0);
            } else if (currTime >= startTime && currTime >= lastWithdrawnTime && currTime <= stopTime) {
              if (paused) {
                return Number(acc) + Number(stream.withdrawnAmount);
              }
              const timeSpan = currTime - Number(lastWithdrawnTime) - Number(acc_paused_time);
              const intervalNum = Math.ceil(timeSpan / interval);
              const withdrawable = walletAdapter?.displayAmount(new BigNumber(Number(BigInt(intervalNum) * BigInt(stream.ratePerInterval) / BigInt(1000))));
              // console.debug("getOutgoingStreams", "paused == false", toHumanAmount(acc + BigInt(stream.withdrawn_amount) + withdrawable));
              return Number(acc) + Number(stream.withdrawnAmount) + Number(withdrawable);
            } else if (currTime > stopTime) {
              if (paused) {
                return Number(acc) + Number(stream.withdrawnAmount);
              } else {
                return Number(acc) + Number(stream.depositAmount);
              }
            }
            return Number(0);
          }, Number(0));

          // console.debug("getOutgoingStreams", "streams outgoing flux sum", outgoingFluxSumH);
          setOutgoingAmount(outgoingAmount);

        });

        FindAddress(accountAddr, chainName, network, {
          page: 0,
          pageSize: 300,
        }).then(response => response.text())
        .then(result => {
          return JSON.parse(result);
        }).then(res => {
          console.log('addr', res)
          setAddressNum(res.total);
        })
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [chainName, network, accountAddr, connected, walletAdapter]);

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