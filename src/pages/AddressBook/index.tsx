import React from "react";
import MyTable from "../../components/Table";
import {TableBody, TableCell, TableRow} from "@mui/material";


const MyTableBody = () => {
  return (
      <TableBody>
        {(tableContent).map((row, idx) => (
            <TableRow key={idx}>
              <TableCell component="th" scope="row" align="center">
                {row.aaa}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.bbb}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.ccc}
              </TableCell>
            </TableRow>
        ))}
      </TableBody>
  )
}

const tableContent = [
  {
    aaa: 1,
    bbb: 2,
    ccc: 3
  },
  {
    aaa: 1,
    bbb: 2,
    ccc: 3
  },
  {
    aaa: 1,
    bbb: 2,
    ccc: 3
  },
  {
    aaa: 1,
    bbb: 2,
    ccc: 3
  },
  {
    aaa: 1,
    bbb: 2,
    ccc: 3
  },
  {
    aaa: 1,
    bbb: 2,
    ccc: 3
  }
]

const AddressBook: React.FC<{}> = () => {
  return (
    <>
      <MyTable
        content={tableContent}
        needPagination={true}
        availablePageSize={[5, 10, 15]}
        columnList={["aaa", "bbb", "ccc"]}
        columnAlign="center"
      >
        <MyTableBody/>
      </MyTable>
    </>
  )
}

export default AddressBook;