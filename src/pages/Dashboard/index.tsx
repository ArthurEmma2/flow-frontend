import React, {useContext, useEffect, useState} from "react";
import MyCard from "../../components/Card";
import {Box, Container, Grid, Typography} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme, styled, withStyles} from "@mui/material/styles";
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
import {StreamStatus} from "../../types/streamStatus";
import StreamInfo from "../../types/streamInfo";
import {FindAddress} from "../../data/address";
import {ChainName} from "../../context/chainName";
import {Network} from "../../context/network";
import {RawCoinInfo, useCoingeckoValue} from "../../hooks/useCoingecko";

interface DashboardContentProp {
  content: string | number | JSX.Element
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

const CustomTypography = styled(Typography)({
  fontSize: "1.5rem"
})

const aptos: RawCoinInfo = {
  coingecko_id: 'aptos',
  symbol: 'aptos',
  name: 'Aptos',
  decimals: 6,
  official_symbol: 'APTOS',
  logo_url: "",
  project_url:"",
  token_type:{
    type: "move",
    account_address: "",
    module_name: "",
    struct_name: "",
  },
  extensions: {
    data: []
  }
}

const Dashboard = () => {
  const {  connected} = useAptosWallet();
  const {walletAdapter} = useContext(WalletAdapter);
  const {chainName} = useContext(ChainName);
  const {network} = useContext(Network);
  const accountAddr = walletAdapter?.getAddress()!;

  const [balance, setBalance] = useState<string>("0");
  
  const [moonBalance, setMoonBalance] = useState<string>("0");
  const [outgoingCanceledNum, setOutgoingCanceledNum] = useState<number>(0);
  const [incomingCanceledNum, setIncomingCanceledNum] = useState<number>(0);
  const [outgoingStreamedNum, setOutgoingStreamedNum] = useState<number>(0);
  const [incomingStreamedNum, setIncomingStreamedNum] = useState<number>(0);
  const [outgoingCompletedNum, setOutgoingCompletedNum] = useState<number>(0);
  const [incomingCompletedNum, setIncomingCompletedNum] = useState<number>(0);
  const [incomingScheduledNum, setIncomingScheduledNum] = useState<number>(0);
  const [outgoingScheduledNum, setOutgoingScheduledNum] = useState<number>(0);
  const [outgoingNum, setOutgoingNum] = useState<number>(0);
  const [incomingNum, setIncomingNum] = useState<number>(0);

  const [incomingAmount, setIncomingAmount] = useState<number>(0);
  
  const [moonIncomingAmount, setMoonIncomingAmount] = useState<number>(0);

  const [outgoingAmount, setOutgoingAmount] = useState<number>(0);
  
  const [moonOutgoingAmount, setMoonOutgoingAmount] = useState<number>(0);

  const [outgoingStreamedSum, setOutgoingStreamedSum] = useState<number>(0);
  
  const [moonOutgoingStreamedSum, setMoonOutgoingStreamedSum] = useState<number>(0);

  const [incomingStreamedSum, setIncomingStreamedSum] = useState<number>(0);
  
  const [moonIncomingStreamedSum, setMoonIncomingStreamedSum] = useState<number>(0);

  const [withdrawableAmount, setWithdrawableAmount] = useState<number>(0);
  
  const [moonWithDrawableAmount, setMoonWithdrawableAmount] = useState<number>(0);
  const [addressNum, setAddressNum] = useState<number>(0);
  const aptosPrice = useCoingeckoValue(aptos, 1);
  aptosPrice[0] = aptosPrice[0] || 0;
  console.log("aptosPrice", aptosPrice  )
  const regex = /\B(?=(\d{3})+(?!\d))/g;


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
          <CardContent content={
            <Box>
              {/* <CustomTypography>{outgoingStreamedSum.toFixed(2)} / {outgoingAmount.toFixed(2)} APT</CustomTypography>
              <CustomTypography>{moonOutgoingStreamedSum.toFixed(2)} / {moonOutgoingAmount.toFixed(2)} MOON</CustomTypography> */}
              <CustomTypography>{'$' + (outgoingStreamedSum * aptosPrice[0] + moonOutgoingStreamedSum).toFixed(2).replace(regex, ',')} / {'$' +  (outgoingAmount * aptosPrice[0] + moonOutgoingAmount).toFixed(2).replace(regex, ',')}</CustomTypography>
            </Box>
          } sx={amountContentStyle}></CardContent>
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
          {<CardContent content={
            <Box>
              {/* <CustomTypography>{incomingStreamedSum.toFixed(2)} / {incomingAmount.toFixed(2)} APT</CustomTypography>
              <CustomTypography>{moonIncomingStreamedSum.toFixed(2)} / {moonIncomingAmount.toFixed(2)} MOON</CustomTypography> */}
              <CustomTypography>{'$' + (incomingStreamedSum * aptosPrice[0] + moonIncomingStreamedSum).toFixed(2).replace(regex, ',')} / {'$' + (incomingAmount * aptosPrice[0] + moonIncomingAmount).toFixed(2).replace(regex, ',')}</CustomTypography>

            </Box>
            } sx={amountContentStyle}></CardContent>}
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
          {<CardContent content={
            <Box>
              {/* <CustomTypography>{withdrawableAmount.toFixed(2)} APT</CustomTypography>
              <CustomTypography>{moonWithDrawableAmount.toFixed(2)} MOON</CustomTypography> */}
              <CustomTypography>{'$' + (withdrawableAmount * aptosPrice[0] + moonWithDrawableAmount).toFixed(2).replace(regex, ',')} </CustomTypography>

            </Box>
            } sx={amountContentStyle}></CardContent>}
        </React.Fragment>,
    },
    {
      title:
        <React.Fragment>
          <div className="flex flex-row justify-start items-center gap-x-1">
            <AccountCircleOutlinedIcon htmlColor="#40187f"/>
            <Typography variant="h6"> Contacts in Address Book</Typography>
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
          <CardContent content={`${(incomingScheduledNum + outgoingScheduledNum).toString()}`} sx={streamContentStyle}></CardContent>
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
          <CardContent content={`${(incomingCompletedNum + outgoingCompletedNum).toString()}`} sx={streamContentStyle}></CardContent>
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
          <CardContent content={`${(outgoingStreamedNum + incomingStreamedNum).toString()}`} sx={streamContentStyle}></CardContent>
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
          <CardContent content={`${(outgoingCanceledNum + incomingCanceledNum).toString()}`} sx={streamContentStyle}></CardContent>
        </React.Fragment>,
    },
  ]

  useEffect(() => {
    if (connected) {
      walletAdapter?.getBalance("APT").then((value) => {
        setBalance(value);
      })
      walletAdapter?.getBalance("MOON").then((value) => {
        setMoonBalance(value);
      })
    }
  }, [walletAdapter, connected])

  useEffect(() => {
    const interval = setInterval(() => {
      if(connected) {
        const currTime = Number(Date.parse(new Date().toString()));

        walletAdapter?.getBalance("APT").then((value) => {
          setBalance(value);
        })
        walletAdapter?.getBalance("MOON").then((value) => {
          setMoonBalance(value);
        })

        walletAdapter?.getIncomingStreams(accountAddr).then(({streams}) => {
          setIncomingNum(streams.length);
          const APTIncomingSum = streams.filter((val) => {return val.coinType === "APT"}).reduce((acc, stream) => {
            return acc + Number(stream.depositAmount);
          }, 0);
          setIncomingAmount(Number(APTIncomingSum.toFixed(4)));

          const MOONIncomingSum = streams.filter((val) => {return val.coinType === "MOON"}).reduce((acc, stream) => {
            return acc + Number(stream.depositAmount);
          }, 0);
          setMoonIncomingAmount(Number(MOONIncomingSum.toFixed(4)));

          const APTIncomingStreamedSum = streams.filter((val) => {return val.coinType === "APT"}).reduce((acc, stream) => {
            return acc + Number(stream.streamedAmount);
          }, 0)
          setIncomingStreamedSum(Number(APTIncomingStreamedSum.toFixed(4)));

          const MOONIncomingStreamedSum = streams.filter((val) => {return val.coinType === "MOON"}).reduce((acc, stream) => {
            return acc + Number(stream.streamedAmount);
          }, 0)
          setMoonIncomingStreamedSum(Number(MOONIncomingStreamedSum.toFixed(4)));

          const scheduledLenIn = streams.reduce((acc, stream) => {
            const isScheduled = stream.status === StreamStatus.Scheduled ? 1 : 0;
            return acc + isScheduled;
          }, 0);
          setIncomingScheduledNum(scheduledLenIn);

          const completedLenIn = streams.reduce((acc, stream) => {
            const isCompleted = stream.status === StreamStatus.Completed ? 1 : 0;
            return acc + isCompleted;
          }, 0);
          setIncomingCompletedNum(completedLenIn);

          const streamingLenIn = streams.reduce((acc, stream) => {
            const isStreaming = stream.status === StreamStatus.Streaming ? 1 : 0;
            return acc + isStreaming;
          }, 0);
          setIncomingStreamedNum(streamingLenIn);

          const canceledLenIn = streams.reduce((acc, stream) => {
            const isCanceled = stream.status === StreamStatus.Canceled ? 1 : 0;
            return acc + isCanceled;
          }, 0);
          setIncomingCanceledNum(canceledLenIn);

          const APTWithdrawableSum = streams.filter((val) => {return val.coinType === "APT"}).reduce((acc, stream) => {
            return acc + Number(stream.withdrawableAmount);
          }, 0);
          setWithdrawableAmount(Number(APTWithdrawableSum.toFixed(4)));

          const MoonWithdrawableSum = streams.filter((val) => {return val.coinType === "MOON"}).reduce((acc, stream) => {
            return acc + Number(stream.withdrawableAmount);
          }, 0);
          setMoonWithdrawableAmount(Number(MoonWithdrawableSum.toFixed(4)));

        });

        walletAdapter?.getOutgoingStreams(accountAddr).then(({streams}) => {
          setOutgoingNum(streams.length);
          // console.debug("getOutgoingStreams", "streams", streams[0]);
          const APTOutgoingSum = streams.filter((val) => {return val.coinType === "APT"}).reduce((acc, stream) => {
            return acc + Number(stream.depositAmount);
          }, 0);
          setOutgoingAmount(Number(APTOutgoingSum.toFixed(4)));

          const MoonOutgoingSum = streams.filter((val) => {return val.coinType === "MOON"}).reduce((acc, stream) => {
            return acc + Number(stream.depositAmount);
          }, 0);

          setMoonOutgoingAmount(Number(MoonOutgoingSum.toFixed(4)));

          const APTOutgoingStreamedSum = streams.filter((val) => {return val.coinType === "APT"}).reduce((acc, stream) => {
            return acc + Number(stream.streamedAmount);
          }, 0)

          setOutgoingStreamedSum(Number(APTOutgoingStreamedSum.toFixed(4)));

          const MoonOutgoingStreamedSum = streams.filter((val) => {return val.coinType === "MOON"}).reduce((acc, stream) => {
            return acc + Number(stream.streamedAmount);
          }, 0);
          setMoonOutgoingStreamedSum(Number(MoonOutgoingStreamedSum.toFixed(4)));

          const scheduledLenOut = streams.reduce((acc, stream) => {
            const isScheduled = stream.status === StreamStatus.Scheduled ? 1 : 0;
            return acc + isScheduled;
          }, 0);
          setOutgoingScheduledNum(scheduledLenOut);

          const completedLenOut = streams.reduce((acc, stream) => {
            const isCompleted = stream.status === StreamStatus.Completed ? 1 : 0;
            return acc + isCompleted;
          }, 0);
          setOutgoingCompletedNum(completedLenOut);

          const streamingLenOut = streams.reduce((acc, stream) => {
            const isStreaming = stream.status === StreamStatus.Streaming ? 1 : 0;
            return acc + isStreaming;
          }, 0);
          setOutgoingStreamedNum(streamingLenOut);

          const canceledLenOut = streams.reduce((acc, stream) => {
            const isCanceled = stream.status === StreamStatus.Canceled ? 1 : 0;
            return acc + isCanceled;
          }, 0);
          setOutgoingCanceledNum(canceledLenOut);
        });

        FindAddress(accountAddr, chainName, network, {
          page: 1,
          pageSize: 10,
        }).then(response => response.text())
        .then(result => {
          return JSON.parse(result);
        }).then(res => {
          setAddressNum(res.total);
        })
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [chainName, network, accountAddr, connected, walletAdapter]);

  return (
    <Box>
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
                  content={<CardContent content={
                    <Box>
                      {/* <CustomTypography>{Number(balance).toFixed(2)} APT</CustomTypography>
                      <CustomTypography>{Number(moonBalance).toFixed(2)} MOON</CustomTypography> */}
                      <CustomTypography>{'$' + (Number(balance)*aptosPrice[0] + Number(moonBalance)).toFixed(2).replace(regex, ',')}</CustomTypography>

                    </Box>
                } sx={{paddingTop: 3, fontSize: "1.5rem"}}></CardContent>}
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
