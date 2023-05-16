import React, {useContext, useEffect, useState} from "react";
import {Types} from "aptos";
import netConfApt from "../../config/configuration.aptos";
import {WalletAdapterNetwork} from "@manahippo/aptos-wallet-adapter";
import {FindAddress} from "../../data/address";
import {ChainName} from "../../context/chainName";
import Address from "../../types/address";
import {useWallet as useAptosWallet} from "@manahippo/aptos-wallet-adapter/dist/WalletProviders/useWallet";
import {
  Alert,
  Button,
  Container,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
  outlinedInputClasses
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import AptosIcon from '../../resources/aptos4.png';
import {DatePicker} from 'antd';
import {gradientButtonStyle} from "../../style/button";
import dayjs from 'dayjs';
import {RawCoinInfo, useCoingeckoValue} from "../../hooks/useCoingecko";
import {useLocation} from 'react-router-dom';


const { RangePicker } = DatePicker;

interface Option {
  addr: string
  name: string
  label: string
}


const intervals = [
  {
    value: 1000,
    label: "second"
  },
  {
    value: 1000 * 60,
    label: "minute"
  },
  {
    value: 1000 * 60 * 60,
    label: "hour"
  },
  {
    value: 1000 * 60 * 60 * 24,
    label: "day"
  },
  {
    value: 1000 * 60 * 60 * 24 * 30,
    label: "month"
  }
]

const NewStream: React.FC<{}> = () => {
  const { wallet, network, account, signAndSubmitTransaction } = useAptosWallet();
  const [enableStreamRate, setEnableStreamRate] = useState(false);
  const [transactionName, setTransactionName] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverInputText, setReceiverInputText] = useState("");
  const [receiverValue, setReceiverValue] = useState<Option | null>(null); // [label, value
  const [token, setToken] = useState("Aptos");
  const [amount, setAmount] = useState(0);
  const [datePickerTime, setDatePickerTime] = useState([dayjs().toISOString(), dayjs().toISOString()]); // [startDate, endDate
  const [remark, setRemark] = useState("");
  const [numberOfTimes, setNumberOfTimes] = useState(undefined);
  const [amountPerTime, setAmountPerTime] = useState(undefined);
  const [interval, setInterval] = useState(1000);
  const {chainName} = useContext(ChainName);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [status, setStatus] = useState<string>("");

  console.log('network', network);

  const handleSwitchChange = () => {
    if(enableStreamRate){
      setEnableStreamRate(false);
      setNumberOfTimes(undefined);
      setAmountPerTime(undefined);
    } else {
      setEnableStreamRate(true);
    }
  }

  const { state } = useLocation();

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

  const aptosPrice = useCoingeckoValue(aptos, 1);


  const getAddress = () => {
    if(account == null || account.address == null || network == null || network.name == null){
      return;
    }
    FindAddress(account.address as string, chainName, network.name, {page, pageSize})
    .then(response => response.json())
    .then(result => {
      console.log('result___', result);
      let addressList: Address[] = [];
      for (let i = 0; i < result.data.length; i++) {
        addressList.push({
          id: result.data[i].id,
          name: result.data[i].name,
          addr: result.data[i].address,
        })
      }
      // console.log('addressList', addressList)
      setAddresses(addressList);
    })
    .catch(error => console.log('error', error));
  }

  const handleReceiverSelect = (newValue: any) => {
    if(newValue == null){
      setReceiverAddress("");
      setReceiverInputText("");
    } else {
      console.log(newValue)
      setReceiverAddress(newValue.addr);
      setReceiverInputText(newValue.label);
    }
  }

  const sendButtonDisabled = () => {

    if(transactionName.length === 0 || receiverAddress.length === 0){
      console.log("fall if 0")

      return true;
    }

    if(!enableStreamRate){
      if(amount === null || isNaN(amount) || amount <= 0 || new Date(datePickerTime[1]) < new Date()){
        return true;
      }
    } else {
      if(numberOfTimes == null || isNaN(parseInt(numberOfTimes)) || parseInt(numberOfTimes) <= 0 || amountPerTime == null || isNaN(parseFloat(amountPerTime)) || parseInt(numberOfTimes) <= 0 || amount === null || isNaN(amount) || amount <= 0 ||  new Date(datePickerTime[1]) < new Date()){
        return true;
      }
    }

    return false;
  }

  useEffect(() => {
    if(account == null || account.address == null || network == null || network.name == null){
      // placeholder
        return;
    }
    getAddress();
  }, [wallet])

  useEffect(() => {
    if(enableStreamRate && numberOfTimes != null && !isNaN(parseInt(numberOfTimes)) && parseFloat(numberOfTimes) > 0 && amountPerTime != null && !isNaN(parseFloat(amountPerTime)) && parseInt(numberOfTimes) > 0){
        setAmount(parseFloat((parseInt(numberOfTimes) * parseFloat(amountPerTime)).toFixed(15)));
        setDatePickerTime([datePickerTime[0], new Date(new Date(datePickerTime[0]).getTime() + parseInt(numberOfTimes) * interval ).toISOString()]);
    }
  }, [numberOfTimes, amountPerTime, interval, enableStreamRate])

  useEffect(() => {
    console.log("state", state)
    if(state!==null && state.address!=null && state.address.length>0){
      const options = generateAddressOptions();
      for(let i=0;i<options.length;i++){
        console.log("options", options)
        if(options[i].addr === state.address){
          setReceiverAddress(state.address);
          setReceiverInputText(options[i].label);
          setReceiverValue(options[i]);
          state.address = "";
          break;
        }
      }
    }
  }, [addresses])

  const generateAddressOptions = () => {
    // console.log("items:", items);
    // return items.map((item:any) => {
    //   return  <MenuItem value={item.addr} key={item.addr}>{`${item.name}(${item.addr.substring(0, 9) + (item.addr.length > 8 ? ("..." + item.addr.substring(item.addr.length-8)): "")})`}</MenuItem>
    // })
      return addresses.map((item:any) => {
        return {
          "label": `${item.name}(${item.addr.substring(0, 9) + (item.addr.length > 8 ? ("..." + item.addr.substring(item.addr.length-8)): "")})`,
          "addr": item.addr,
          "name": item.name,
        };
      })
  }

  const createStream = (name: string, remark: string, recipientAddr: string, depositAmount: number,
                        startTime: string, stopTime: string,
                        interval: number, canPause?: boolean,
                        closeable?: boolean, recipientModifiable?: boolean) => {
    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: 'entry_function_payload',
      function: `${netConfApt.contract}::stream::create`,
      arguments: [
        name,
        remark,
        recipientAddr,
        depositAmount * 10 ** 8,
        startTime,
        stopTime,
        Math.floor(interval/1000).toString(),
        true,
        true,
        true,
      ],
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
    };

    const res = signAndSubmitTransaction(transaction)
    return res;
  }

  const handleSend = () => {
    // if (network != null && network.name != null && network.name !== WalletAdapterNetwork.Testnet) {
    //   setStatus("failed");
    //   setAlertMessage("Please switch to Testnet!")
    //   setShowAlert(true);
    //   return;
    // }
    createStream(
      transactionName,
      remark,
      receiverAddress,
      amount,
      dayjs(datePickerTime[0]).unix().toString(),
      dayjs(datePickerTime[1]).unix().toString(),
      interval,
      true,
      true,
      true
    ).then(() => {
      setStatus("success");
      setAlertMessage("The Stream has been created successfully!")
      setShowAlert(true);
    });
  }

  const generateOptions = (items:any, valueField: string, labelField: string) => {
    return items.map((item: any) => {
      return  <MenuItem value={item[valueField]} key={item[valueField]}>{item[labelField]}</MenuItem>
    })
  }

  console.log("receiverInputText", receiverInputText);

  return (
    <Container>
      <Typography
        variant="h5"
        color="white"
        sx={{marginBottom: 4}}
      >
        Continuous Streams
      </Typography>
      <Snackbar open={showAlert} autoHideDuration={4000} onClose={() => setShowAlert(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}} style={{marginTop: "50px"}}>
        { status === "success" ?
          <Alert onClose={() => setShowAlert(false)} severity="success">
            {alertMessage}
          </Alert> :
          <Alert onClose={() => setShowAlert(false)} severity="error">
            {alertMessage}
          </Alert>
        }
      </Snackbar>
      <Grid container spacing={6}>
        <Grid item sm={8}>
          <Paper sx={{
            background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);",
            width: "100%",
            height: "550px",
            marginTop: "0px",
            padding:"30px"
          }}>
            <Grid container spacing={3}>
              <Grid item sm={6}>
                <InputLabel shrink>Transaction Name</InputLabel>
                <input
                  type="text"
                  value={transactionName}
                  onChange={(e) => setTransactionName(e.target.value)}
                  style={{ backgroundColor: "#313138", marginBottom: "0" }}
                  className="w-full bg-blue-200 text-sm rounded mb-4 p-2 input-field"
                  placeholder="Transaction Name"
                />        
              </Grid>
              <Grid item sm={6}>
                <InputLabel shrink>Reveiver Wallet Address</InputLabel>
                <Autocomplete
                  value={receiverValue}
                  inputValue={receiverInputText}
                  freeSolo
                  options={generateAddressOptions()}
                  onChange={(e: any, newValue: any) => {
                    handleReceiverSelect(newValue)
                  }}
                  onInputChange={(e, newInputValue) => {
                    setReceiverAddress(newInputValue);
                    setReceiverInputText(newInputValue);
                    setReceiverValue(null);
                  }}
                  sx = {{
                    "& .MuiInputBase-inputSizeSmall": {
                      height: "19px"
                    },
                    '& .MuiFormLabel-root': {
                      fontSize: '0.875rem',
                      color: 'darkGray',
                    },
                    '& input': {
                      fontSize: '0.875rem',
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f143e2 !important"
                    },
                  }}
                  renderInput={(params) => 
                    <TextField {...params} label="address" size="small" sx={{ backgroundColor: "#313138", height:"35px"}}/>
                  }
                />
              </Grid>
              <Grid item sm={12}>
                <InputLabel shrink>Remarks</InputLabel>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  style={{ backgroundColor: "#313138", marginBottom: "0" }}
                  className="w-full bg-blue-200 text-sm rounded mb-4 p-2 input-field"
                  placeholder="Enter the remarks here (Optional)"
                />        
              </Grid>
              <Grid item sm={6}>
                <InputLabel shrink>Token</InputLabel>
                <Select
                  value={token}
                  sx={{
                    width: "100%", 
                    height:"35px",
                    backgroundColor: "#313138",
                    fontSize: "0.875rem",
                    "&:hover > .MuiOutlinedInput-notchedOutline" : {
                      borderColor : "#f143e2"
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        "& .MuiMenuItem-root.Mui-selected": {
                          backgroundColor: "grey"
                        },
                        "& .MuiMenuItem-root:hover": {
                          backgroundColor: "grey"
                        },
                        "& .MuiMenuItem-root.Mui-selected:hover": {
                          backgroundColor: "grey"
                        },
                      }
                    }
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  displayEmpty
                >
                  <MenuItem value={"Aptos"} key={"Aptos"}><img src={AptosIcon} alt="logo" width={18} height={18} style={{float: "left", marginRight: "5px"}}/>{"Aptos"}</MenuItem>
                </Select>
              </Grid>
              <Grid item sm={6}>
                <InputLabel shrink sx={{width:"450px"}}>Amount <span style={{float: "right"}}>${useCoingeckoValue(aptos, amount)[0]}</span></InputLabel>
                <input
                  disabled={enableStreamRate}
                  type="text"
                  value={amount}
                  onChange={(e: any) => setAmount(e.target.value)}
                  style={{ backgroundColor: "#313138", marginBottom: "0", color: enableStreamRate ? "grey" : "white" }}
                  className="w-full bg-blue-200 text-sm rounded mb-4 p-2 input-field"
                  placeholder="Enter amount to send"
                />        
              </Grid>
              <Grid item sm={12}>
                <InputLabel shrink>Time</InputLabel>
                <RangePicker 
                  showTime 
                  style={{width: "100%", backgroundColor: "#313138"}}
                  value={[dayjs(datePickerTime[0]), dayjs(datePickerTime[1])]}
                  onChange={(value, dateString) => {
                      setDatePickerTime(dateString);
                  }}
                  disabled={[false, enableStreamRate]}
                  // suffixIcon={null}
                  allowClear={false}
                  popupClassName={"createDateRangePicker"}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{padding: 1}}>
              <Grid item sm={6}>
                <FormControlLabel
                  control={
                    <Switch checked={enableStreamRate} onChange={handleSwitchChange} name="gilad" />
                  }
                  label="Enable Stream Rate"
                />
              </Grid>
            </Grid>
            {enableStreamRate &&
              <Grid container spacing={3} sx={{padding: 1}}>
                <Grid item sm={4}>
                  <InputLabel shrink>No.of Time</InputLabel>
                  <input
                    type="text"
                    value={numberOfTimes}
                    onChange={(e: any) => setNumberOfTimes(e.target.value)}
                    style={{ backgroundColor: "#313138", marginBottom: "0" }}
                    className="w-full bg-blue-200 text-sm rounded mb-4 p-2 input-field"
                    placeholder="E.g. 4"
                  />        
                </Grid>
                <Grid item sm={4}>
                  <InputLabel shrink>Token Amount</InputLabel>
                  <input
                    type="text"
                    value={amountPerTime}
                    onChange={(e: any) => setAmountPerTime(e.target.value)}
                    style={{ backgroundColor: "#313138", marginBottom: "0" }}
                    className="w-full bg-blue-200 text-sm rounded mb-4 p-2 input-field"
                    placeholder="E.g. 4"
                  />        
                </Grid>
                <Grid item sm={4}>
                  <InputLabel shrink>Time interval</InputLabel>
                  <Select
                    value={interval}
                    onChange={(e: any) => setInterval(e.target.value)}
                    sx={{
                      width: "100%",
                      backgroundColor: "#313138",
                      height:"35px",
                      fontSize: "0.875rem",
                      "&:hover > .MuiOutlinedInput-notchedOutline" : {
                        borderColor : "#f143e2"
                      }
                    }}
                    disableUnderline
                    MenuProps={{ 
                      style: {
                        maxHeight: 400,
                      },
                    }}
                  > { generateOptions(intervals, "value", "label")}
                  </Select>                  
                </Grid>
              </Grid>
            }
            <div className="flex justify-center items-center mt-5 mb-2">
              <Button 
                disabled={sendButtonDisabled()}
                size="small" sx={{...gradientButtonStyle, width: "150px"}} onClick={(e) => {
                e.preventDefault();
                handleSend();
              }}>Send</Button>
            </div>
          </Paper>
        </Grid>
        <Grid item sm={4}>
          <Grid container spacing={3} sx={{padding: 1}}>
            <Paper sx={{
              background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);",
              width: "100%",
              height:"260px",
              marginTop: "16px",
              marginBottom: "30px",
              padding: "20px"
            }}>
              {/* <div className="text-xl mt-1 mb-1" >The receiver will gradually receive the payment per second.</div> */}
              <p style={{fontSize: "16px", color: "rgba(255, 255, 255, 0.7)"}}>The receiver will gradually receive the payment per second.</p>
              <Typography variant="h6" gutterBottom sx={{marginTop: "20px"}}>
                Note:
              </Typography>
              <Typography variant="body1" gutterBottom sx={{fontSize: "16px", marginTop:"10px"}}>
                We only support streams to wallets on Move Ecosystems.
              </Typography>
              <Typography variant="body1" gutterBottom sx={{fontSize: "16px", marginTop:"10px"}}>
                Token Streamed to exchange wallets can't be withdrawn.
              </Typography>
            </Paper>
            <Paper sx={{
              background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);",
              width: "100%",
              height:"260px",
              padding: "20px"
            }}>
              <Typography variant="h6" gutterBottom>
                Stream Overview
              </Typography>
              <Typography variant="body1" gutterBottom sx={{fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", marginTop: "20px" }}>
                Stream start on {new Date(datePickerTime[0]).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom sx={{fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", marginTop: "20px" }}>
                {amount} Aptos will be sent to receiver wallet.
              </Typography>
              <Typography variant="body1" gutterBottom sx={{fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", marginTop: "20px" }}>
                Stream ends on {new Date(datePickerTime[1]).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default NewStream;

