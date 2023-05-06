import React, {ChangeEventHandler, ReactNode } from "react";
import {
    TableRow,
    Table,
    TableCell,
    Paper,
    TableContainer,
    TableHead,
    TableFooter, TableBody,
} from "@mui/material";
import MyTablePagination from "./Pagination";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface TableProps {
    children?: ReactNode;
    content: any[]
    needPagination: boolean
    availablePageSize: number[]
    columnList: string[]
    columnAlign: "center" | "left" | "right",
    page: number,
    pageSize: number,
    totalNum: number,
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onRowsPerPageChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
    tableSx?: SxProps<Theme>,
}

const MyTable = (props: TableProps) => {
    const {
        children,
        needPagination,
        availablePageSize,
        columnList,
        columnAlign,
        page,
        pageSize,
        totalNum,
        onPageChange,
        onRowsPerPageChange,
        tableSx,
    } = props

    return (
        <TableContainer component={Paper} sx={tableSx}>
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            columnList.map((val, index) => {
                                if (val === "") {
                                    return <TableCell key={index}/>
                                }
                                return (
                                  <TableCell key={index} align={columnAlign}>{val}</TableCell>
                                )
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {children}
                </TableBody>
                {
                  needPagination && <TableFooter>
                      <TableRow sx={{ borderSize: 0}}>
                          <MyTablePagination
                            availablePageSize={availablePageSize}
                            totalNumber={totalNum}
                            rowsPerPage={pageSize}
                            page={page}
                            selectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={onPageChange}
                            onRowsPerPageChange={onRowsPerPageChange}
                          />
                      </TableRow>
                  </TableFooter>
                }
            </Table>
        </TableContainer>
    )
}

export default MyTable;