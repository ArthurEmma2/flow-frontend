import React, {ChangeEvent, MouseEvent, ReactNode, useState} from "react";
import {
    TableRow,
    Table,
    TableCell,
    Paper,
    TableContainer,
    TableHead,
    TableBody,
    TableFooter,
    TablePagination
} from "@mui/material";
import MyTablePagination from "./Pagination";

interface TableProps {
    children?: ReactNode;
    content: any[]
    needPagination: boolean
    availablePageSize: number[]
    columnList: string[]
    columnAlign: "center" | "left" | "right",
}

const MyTable = ({ children, content, needPagination, availablePageSize, columnList, columnAlign}: TableProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper}>
            <TableHead>
                <TableRow>
                    {
                        columnList.map((val, index) => {
                            if (val === "") {
                                return <TableCell/>
                            }
                            return (
                                <TableCell align={columnAlign}>{val}</TableCell>
                            )
                        })
                    }
                </TableRow>
            </TableHead>
            {children}
            {
                needPagination && <TableFooter>
                    <TableRow>
                        <MyTablePagination
                            availablePageSize={availablePageSize}
                            totalNumber={content.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            selectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            }
        </TableContainer>
    )
}

export default MyTable;