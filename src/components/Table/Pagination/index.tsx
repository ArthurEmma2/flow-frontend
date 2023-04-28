import {ChangeEvent, ChangeEventHandler, MouseEvent, useState} from "react";
import {Box, IconButton, SelectProps, TablePagination, useTheme} from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import * as React from "react";

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

interface PaginationProps {
    totalNumber: number
    rowsPerPage: number
    page: number
    availablePageSize: number[]
    selectProps: Partial<SelectProps>
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onRowsPerPageChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
}

const MyTablePaginationAction = (props: TablePaginationActionsProps) => {
    const { count, page, rowsPerPage, onPageChange } = props;

    const theme = useTheme();

    const handleFirstPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>

    )
}

const MyTablePagination = (props: PaginationProps) => {
    const {totalNumber, rowsPerPage, page, availablePageSize, selectProps, onPageChange, onRowsPerPageChange} = props

    return (
        <TablePagination
            rowsPerPageOptions={availablePageSize}
            colSpan={3}
            count={totalNumber}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={selectProps}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            ActionsComponent={MyTablePaginationAction}
        />

    )
}

export default MyTablePagination;