import React from "react";
import {
    Box,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function FavEventTable({ selectedData = [] }) {
    const columns = [
        columnHelper.accessor('checkbox', {
            id: 'checkbox',
            cell: (info) => {
                const row = info.row.original;
                return (
                    <Checkbox
                        checked={true}
                        size="small"
                    />
                );
            },
        }),

        columnHelper.accessor('summary', {
            id: 'summary',
            cell: (info) => {
                const row = info.row.original;
                return (
                    <Box>
                        <Typography variant="body2" fontWeight="bold">
                            {row.name} - {' '}
                            <Box component="span" sx={{ color: 'text.secondary' }}>
                                {row.sender}
                            </Box>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {row.date} {row.time} {row.location}
                        </Typography>
                    </Box>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: selectedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Paper elevation={0} sx={{
            p: 2,
            width: "47%",
            borderRadius: "20px",
            margin: "0 2%",
            marginTop: "2%",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            backgroundColor: "white",
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginLeft={1} marginRight={2}>
                <Typography variant="h6" fontWeight="bold">
                    My Upcoming Events
                </Typography>
            </Box>

            <TableContainer>
                <Table size="small">
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{
                                    borderBottom: 'none',
                                    height: 100,
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    fontStyle: 'italic',
                                    color: 'grey.600',
                                }}
                                >
                                    No Selected Events
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} sx={{ borderBottom: "8px solid transparent" }}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
