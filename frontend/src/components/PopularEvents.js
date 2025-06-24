import React, { useState, useEffect } from "react";
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Box
} from "@mui/material";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import axios from "axios";

const columnHelper = createColumnHelper();

export default function PopularEvents() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost/email_scraper/Backend/Events/admin_stats.php", {
                    withCredentials: true
                });
                const filtered = response.data
                    .filter(event => Number(event.interested_votes) > 0)
                    .sort((a, b) => b.interested_votes - a.interested_votes)
                    .slice(0, 5);
                setStats(filtered);
            } catch (error) {
                console.error("Failed to fetch stats: ", error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        columnHelper.display({
            id: 'index',
            header: '#',
            cell: ({ row }) => (
                <Typography variant="h6" fontWeight="bold">
                    {row.index + 1}.
                </Typography>
            ),
            size: 6,
        }),
        columnHelper.accessor('summary', {
            id: 'summary',
            cell: (info) => {
                const row = info.row.original;
                console.log(row);
                return (
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {row.meeting_title}
                        </Typography>
                        <Typography variant="caption2" color="text.primary">
                            ⭐ {row.interested_votes} votes
                        </Typography>
                    </Box>
                );
            },
        }),
    ]

    const table = useReactTable({
        data: stats,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Paper elevation={0} sx={{
            p: 2,
            maxWidth: "100%",
            borderRadius: "20px",
            marginRight: "2%",
            marginTop: "2%",
            marginBottom: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            backgroundColor: "white",
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginLeft={1} marginRight={2}>
                <Typography variant="h6" fontWeight="bold">
                    Top 5 Most Popular Events 🔥
                </Typography>
            </Box>

            <TableContainer sx = {{
                maxHeight: "40vh",
                overflowY: "auto",
            }}>
                <Table size="small">
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{
                                    height: 100,
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    fontStyle: 'italic',
                                    color: 'grey.600',
                                }}
                                >
                                    No popular events to display
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