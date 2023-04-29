import React, {useContext, useEffect, useState} from "react";
import MyTable from "../../components/Table";
import {Container, Grid, IconButton, Paper, TableCell, TableRow} from "@mui/material";
import Address from "../../types/address";
import {AddAddress, DeleteAddress, FindAddress} from "../../data/address";
import {stringWithEllipsis} from "../../utils/string";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {ChainName} from "../../context/chainName";
import {Network} from "../../context/network";
import {Typography, Input} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SendIcon from '@mui/icons-material/Send';
import * as net from "net";

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
  const creator = "0x58e3511aa31f0bd694d95ad6148e33cb45c52356eca673847c51dd3b13a66983"
  const columnList = ["Name", "Address", "", "", ""]

  function handleAdd() {
    AddAddress(creator, addressName, walletAddress, chainName, network)
      .then(response => response.json())
      .then(() => {
        setAddressName("");
        setWalletAddress("");
      })
      .catch(error => {

      })
  }

  // todo
  function handleUpdate() {

  }

  function handleDelete(row: Address) {
    if (row.id === undefined) {
      return
    }
    DeleteAddress(row.id)
      .then(response => response.text())
      .then(result => {
        // todo: add notification
      })
      .catch(error => {
        // todo: add notification
      })

  }

  // todo
  function handleSend() {

  }

  function copyAddress(row: Address) {
    navigator.clipboard.writeText(row.addr);
  }

  useEffect(() => {
    FindAddress(creator, chainName, network, {page, pageSize})
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
  }, [chainName, network, page, pageSize])

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid item lg={8}>
          <Box>
            <Typography variant="h5" color="white" sx={{marginBottom: "1rem"}}>Address Book</Typography>
            <MyTable
              content={addresses}
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
              {addresses.length === 0 ? <></> : (addresses).map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" align="center">
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
                    <IconButton onClick={() => {handleUpdate()}}>
                      <ModeEditOutlineOutlinedIcon fontSize="small"/>
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => {handleSend()}}>
                      <SendIcon fontSize="small"/>
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => {handleDelete(row)}}>
                      <CancelOutlinedIcon fontSize="small"/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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