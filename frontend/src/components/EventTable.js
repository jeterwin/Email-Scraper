import React from 'react';
import {
    Box,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export default function EventTable({ tableData, showButton = true }) {
    const [sorting, setSorting] = React.useState([]);

    const columns = [
        columnHelper.accessor('name', {
            id: 'name',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    NAME
                </Typography>
            ),
            cell: (info) => {
                return (
                    <Box display="flex" alignItems="center">
                        <Typography variant="body2" fontWeight="bold">
                            {info.getValue()}
                        </Typography>
                    </Box>
                );
            },
        }),
        columnHelper.accessor('sender', {
            id: 'sender',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    SENDER
                </Typography>
            ),
            cell: (info) => (
                <Typography variant="body2" fontWeight="bold">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('sendDate', {
            id: 'sendDate',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    SEND DATE
                </Typography>
            ),
            cell: (info) => (
                <Typography variant="body2" fontWeight="bold">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('location', {
            id: 'location',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    LOCATION
                </Typography>
            ),
            cell: (info) => (
                <Typography variant="body2" fontWeight="bold">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('date', {
            id: 'date',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    DATE
                </Typography>
            ),
            cell: (info) => (
                <Typography variant="body2" fontWeight="bold">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('time', {
            id: 'time',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    TIME
                </Typography>
            ),
            cell: (info) => (
                <Typography variant="body2" fontWeight="bold">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('cc', {
            id: 'cc',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    CC
                </Typography>
            ),
            cell: (info) => (
                <Typography variant="body2" fontWeight="bold">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('checkbox', {
            id: 'checkbox',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    INTERESTED
                </Typography>
            ),
            cell: (info) => {
                const row = info.row.original;
                return (
                    <Box display="flex" alignItems="center">
                        <Checkbox
                            size="small"
                            sx={{ mr: 1 }} />
                    </Box>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: tableData,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <Paper elevation={0} sx={{
            p: 2,
            overflowX: 'auto',
            backgroundColor: 'white',
            width: '96%',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '20px',
            margin: '0 auto',
            paddingBottom: '2%',
            marginTop: '2%',
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginLeft={1} marginRight={2}>
                <Typography variant="h5" fontWeight="bold">
                    Events
                </Typography>
                <div>
                    {showButton && (
                        <Box component={Link} to="/events" sx={{
                            fontFamily: 'Arial',
                            fontSize: '14px',
                            textDecoration: 'none',
                            color: 'grey.800',
                            border: '1px solid',
                            borderColor: 'grey.400',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            display: 'inline-block',
                            '&:hover': {
                                backgroundColor: 'grey.100',
                            },
                        }}>
                            View all events
                        </Box>
                    )}
                </div>

            </Box>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === 'asc'
                                                ? ' ↑'
                                                : header.column.getIsSorted() === 'desc'
                                                    ? ' ↓'
                                                    : ''}
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
