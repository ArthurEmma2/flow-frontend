import React, {ChangeEvent, useEffect, useState} from "react";
import MyTable from "../../components/Table";
import {TableBody, TableCell, TableRow} from "@mui/material";
import Address from "../../types/address";
import {DeleteAddress, FindAddress} from "../../data/address";
import {stringWithEllipsis} from "../../utils/string";
import Button from "@mui/material/Button";


const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalNum, setTotalNum] = useState(0);
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
      {(addresses).map((row) => (
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
  )
}

export default AddressBook;