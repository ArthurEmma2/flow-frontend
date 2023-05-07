import React, {useContext, useEffect, useState} from "react";
import MyTable from "../../components/Table";
import {Container, Grid, IconButton, Paper, TableCell, TableRow, withStyles, Table, TableBody, TableContainer, TableHead, TablePagination, Snackbar, Tooltip, Alert} from "@mui/material";
import Address from "../../types/address";
import {addAddress, deleteAddress, findAddress, updateAddress} from "../../data/address";
import {stringWithEllipsis} from "../../utils/string";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {ChainName} from "../../context/chainName";
import {Network} from "../../context/network";
import {Typography, Input} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SendIcon from '@mui/icons-material/Send';
import {gradientButtonStyle} from "../../style/button";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import {useNavigate} from "react-router-dom";

const tableStyle: SxProps<Theme> = {
  background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);",
  borderRadius: "8px",
  width: "100%",
}

const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalNum, setTotalNum] = useState(0);
  const [addressName, setAddressName] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const {chainName} = useContext(ChainName);
  const {network} = useContext(Network);
  // const creator = "0x58e3511aa31f0bd694d95ad6148e33cb45c52356eca673847c51dd3b13a66983"
  const columnList = ["Name", "Address", "", "", ""]
  const [status, setStatus] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingObj, setEditingObj] = useState({
    id: "",
    addr: "",
    name:"",
  });

  const wallet = useWallet();
  const navigate = useNavigate();

  function handleAdd() {
    if(wallet.account == null || wallet.account.address == null || wallet.network == null || wallet.network.name == null){
      // placeholder
        return;
    }
    addAddress(wallet.account.address, addressName, walletAddress, chainName, wallet.network.name)
      .then(response => {
        console.log("response", response);
        return response.json()
      })
      .then(() => {
        setAddressName("");
        setWalletAddress("");
        setPage(1);
        setStatus("success");
        setAlertMessage("New address has been created successfully.");
        setShowAlert(true);
      })
      .catch(error => {
        setStatus("error");
        setAlertMessage("Failed to create the new address. Please try again.")
        setShowAlert(true);
      })
  }


  function handleUpdate() {
    if (editingObj.id === undefined) {
      return
    }
    if(wallet.account == null || wallet.account.address == null || wallet.network == null || wallet.network.name == null){
      // placeholder
        return;
    }
    updateAddress(wallet.account.address,editingObj.name, editingObj.addr, chainName, wallet.network.name, editingObj)
      .then(response => response.text())
      .then(result => {
        setPage(1);
        setStatus("success");
        setAlertMessage("The address has been updated successfully.")
        setEditing(false)
        setEditingObj({
          id: "",
          addr: "",
          name:"",
        })
        setShowAlert(true);
      })
      .catch(error => {
        setStatus("error");
        setAlertMessage("Failed to update the address. Please try again")
        setShowAlert(true);
        setEditing(false)
        setEditingObj({
          id: "",
          addr: "",
          name:"",
        })
      })
  }


  function handleDelete(row: Address) {
    if (row.id === undefined) {
      return
    }
    deleteAddress(row.id)
      .then(response => response.text())
      .then(result => {
        setPage(1);
        setStatus("success");
        setAlertMessage("The address has been deleted successfully.")
        setShowAlert(true);
      })
      .catch(error => {
        setStatus("error");
        setAlertMessage("Failed to delete the address. Please try again.");
        setShowAlert(true);
      })
  }

  const handleUpdateClick = (row: Address) => {
    setEditing(true)
    setEditingObj({
      id: row.id ?? "",
      addr: row.addr,
      name: row.name,
    });
  }

  const handleCancelUpdate = () => {
    setEditing(false)
    setEditingObj({
      id: "",
      addr: "",
      name:"",
    })
  }

  const handleNameUpdate = (e: any) => {
    setEditingObj({
      ...editingObj,
      name: e.target.value,
    })
  }

  const handleAddrUpdate = (e: any) => {
    setEditingObj({
      ...editingObj,
      addr: e.target.value,
    })
  }



  function handleSend(disabled: boolean = false, row: Address) {
    if(!disabled){
      navigate("/new_stream", {
        state: {
          address: row.addr,
          name: row.name,
        }
      })
    }
  }

  function copyAddress(row: Address) {
    navigator.clipboard.writeText(row.addr);
  }

  const getAddress = () => {
    if(wallet.account == null || wallet.account.address == null || wallet.network == null || wallet.network.name == null){
      return;
    }
    findAddress(wallet.account.address, chainName, wallet.network.name, {page, pageSize})
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
      setAddresses(addressList);
      setTotalNum(result.total);
    })
    .catch(error => console.log('error', error));
  }


  useEffect(() => {
    if(wallet.account == null || wallet.account.address == null || wallet.network == null || wallet.network.name == null){
      // placeholder
        return;
    }
    getAddress();
  }, [chainName, network, page, pageSize, wallet, showAlert])

  return (
    <Container>
     <Snackbar open={showAlert} autoHideDuration={4000} onClose={() => setShowAlert(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}} style={{marginTop: "50px"}}>
        { status === "success" ?
          <Alert onClose={() => setShowAlert(false)} severity="success">
            {alertMessage}
          </Alert> :
          <Alert onClose={() => setShowAlert(false)} severity="error">
            {alertMessage}
          </Alert>
        }
      </Snackbar>      <Grid container spacing={5}>
        <Grid item lg={8}>
          <Box>
            <Typography variant="h5" color="white" sx={{marginBottom: "1rem"}}>Address Book</Typography>
            <MyTable
              content={addresses}
              needPagination={true}
              availablePageSize={[5, 10, 15]}
              columnList={columnList}
              columnAlign="left"
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
              {addresses.length === 0 ? <></> : (addresses).map((row) =>
              {
                if(!editing || (editing && row.id !== editingObj.id) ){
                    return (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row" align="left">
                          {row.name}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="center">
                          <div className="flex flex-row items-center gap-x-1">
                            {stringWithEllipsis(row.addr)}
                            <IconButton onClick={() => {copyAddress(row)}}>
                              <ContentCopyIcon fontSize="small"/>
                            </IconButton>
                          </div>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => {handleUpdateClick(row)}}>
                            <ModeEditOutlineOutlinedIcon fontSize="small"/>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => {handleSend(false, row)}}>
                            <SendIcon fontSize="small"/>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => {handleDelete(row)}}>
                            <CancelOutlinedIcon fontSize="small"/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                } else {
                  return (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row" align="left">
                        <input
                          type="text"
                          value={editingObj.name}
                          onChange={(e) => handleNameUpdate(e)}
                          style={{ backgroundColor: "#313138", marginBottom: "0" }}
                          className="w-full bg-blue-200 text-sm rounded mb-4 p-2"
                        />                    
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        <div className="flex flex-row items-center gap-x-1">
                          <input
                            type="text"
                            value={editingObj.addr}
                            onChange={(e) => handleAddrUpdate(e)}
                            style={{ backgroundColor: "#313138", marginBottom: "0" }}
                            className="w-full bg-blue-200 text-sm rounded mb-4 p-2"
                          />    
                        </div>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {handleUpdate()}}>
                          <CheckCircleOutlineRoundedIcon  fontSize="small"/>
                        </IconButton>
                        <IconButton onClick={() => {handleCancelUpdate()}}>
                          <CancelOutlinedIcon  fontSize="small"/>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {handleSend(true, row)}}>
                          <SendIcon fontSize="small"/>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {handleDelete(row)}}>
                          <CancelOutlinedIcon fontSize="small"/>
                        </IconButton>
                      </TableCell>
                    </TableRow>                  
                  )
                }
              })}
            </MyTable>
          </Box>
        </Grid>
        <Grid item lg={4}>
          <Box>
            <Typography variant="h5" color="white" sx={{marginBottom: "1rem"}}>Add an Address</Typography>
            <Paper elevation={0} sx={{ background: "linear-gradient(101.44deg, #141620 1.73%, #0E111B 98.85%);", padding: 4}}>
              <div>
                <div className="text-xl mt-1 mb-1">Address Name</div>
                <input
                  type="text"
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                  style={{ backgroundColor: "#313138"}}
                  className="w-full bg-blue-200 text-sm rounded mb-4 p-2"
                  placeholder="Enter Name"
                />
              </div>
              <div>
                <div className="text-xl mb-1">Wallet Address</div>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  style={{ backgroundColor: "#313138" }}
                  className="w-full bg-blue-200 text-sm rounded mb-4 p-2"
                  placeholder="Enter Address"
                />
              </div>
              <div className="flex justify-center items-center mt-5 mb-2">
                <Button size="small" onClick={handleAdd}>Add Address</Button>
              </div>
            </Paper>
          </Box>


        </Grid>
      </Grid>


    </Container>
  )

}

export default AddressBook;