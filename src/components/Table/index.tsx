import React, {ChangeEvent, ChangeEventHandler, MouseEvent, ReactNode, useState} from "react";
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
    page: number,
    pageSize: number,
    totalNum: number,
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onRowsPerPageChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
}

const MyTable = (props: TableProps) => {
    const {
        children,
        content,
        needPagination,
        availablePageSize,
        columnList,
        columnAlign,
        page,
        pageSize,
        totalNum,
        onPageChange,
        onRowsPerPageChange,
    } = props

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
        </TableContainer>
    )
}

export default MyTable;