import React, {useContext, useEffect, useState} from "react";
import MyTable from "../../components/Table";
import {Grid, Paper, TableCell, TableRow} from "@mui/material";
import Address from "../../types/address";
import {AddAddress, DeleteAddress, FindAddress} from "../../data/address";
import {stringWithEllipsis} from "../../utils/string";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {ChainName} from "../../context/chainName";
import {Network} from "../../context/network";


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

    AddAddress(creator, addressName, walletAddress, chainName, network)
      .then(response => response.json())
      .then(() => {
        setAddressName("");
        setWalletAddress("");
      })
      .catch(error => {

      })
  }

  useEffect(() => {
    FindAddress(creator, "sui", "testnet", {page, pageSize})
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
  }, [page, pageSize])

  return (
    <Box sx={{paddingLeft: 5, paddingRight: 5}}>
      <Grid container spacing={5}>
        <Grid item lg={8}>
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
          >
            {addresses.length === 0 ? <></> : (addresses).map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row" align="center">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {stringWithEllipsis(row.addr)}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => {handleUpdate()}}>Edit</Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => {handleDelete(row)}}>Delete</Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => {handleSend()}}>Send</Button>
                </TableCell>
              </TableRow>
            ))}
          </MyTable>
        </Grid>
        <Grid item lg={4}>
          <Paper elevation={0} sx={{ backgroundColor: "grey", padding: 4}}>
            <div className="text-2xl font-bold">Add an Address</div>
            <div>
              <div className="text-xl mt-1">Address Name</div>
              <input
                type="text"
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
                style={{ backgroundColor: "#383A47"}}
                className="w-full bg-blue-200 text-xl rounded mt-1 p-2"
                placeholder="Enter Name"
              />
            </div>
            <div>
              <div className="text-xl mt-1">Wallet Address</div>
              <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} style={{backgroundColor: "#383A47", }} className="w-full bg-blue-200 text-xl rounded mt-1 p-2" placeholder="Enter Address"/>
            </div>
            <div className="flex justify-center items-center mt-5 mb-2">
              <Button size="small">Add Address</Button>
            </div>
          </Paper>
        </Grid>
      </Grid>

    </Box>

  )
}

export default AddressBook;