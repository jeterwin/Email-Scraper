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
import Button from "@mui/material/Button";

const columnHelper = createColumnHelper();

export default function FavEventTable({ selectedData = [] }) {
    const columns = [
        columnHelper.accessor('daysDue', {
            id: 'daysDue',
            cell: (info) => {
                const row = info.row.original;
                const now = new Date();
                const eventDate = new Date(row.datetime);
                const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const eventMidnight = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

                const msInDay = 1000 * 60 * 60 * 24;
                const diffTime = eventMidnight - nowMidnight;
                const diffDays = Math.floor(diffTime / msInDay);

                let displayText;
                if (diffDays > 0) {
                    displayText = (
                        <>
                            in <Box component="span" fontWeight="bold">{diffDays}</Box> day{diffDays > 1 ? "s" : ""}
                        </>
                    );
                } else if (diffDays === 0) {
                    displayText = <Box component="span" fontWeight="bold">Today</Box>;
                } else {
                    displayText = <Box component="span" fontWeight="bold">Passed</Box>;
                }

                return (
                    <Typography variant="subtitle2" color="text.primary">
                        {displayText}
                    </Typography>
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
                            {(row.datetime).toLocaleString()} — {row.location}
                        </Typography>
                    </Box>
                );
            },
        }),
        columnHelper.display( {
            id: 'drop',
            cell: ({ row }) => {
                const user = row.original;
                // const handlePromote = async () => {
                //     try{
                //         const response = await fetch("http://localhost/email_scraper/Backend/Auth/promote.php", {
                //             method: 'POST',
                //             headers: {
                //                 "Content-Type": "application/x-www-form-urlencoded",
                //             },
                //             body: new URLSearchParams({ user_id: user.id }),
                //             credentials: "include",
                //         });
                //         const message = await response.text();
                //         console.log(message)
                //
                //         if (response.ok){
                //             setTableData(prev =>
                //                 prev.map(u =>
                //                     u.id === user.id ? { ...u, role: 'admin' } : u
                //                 )
                //             );
                //         } else {
                //             console.error("Promotion failed: ", message);
                //         }
                //     } catch (error){
                //         console.error("Error promoting user: ", error);
                //     }
                // };

                return (
                    <Button
                        variant="outlined"
                        size="small"
                        // onClick={handlePromote}
                    >
                        Remove
                    </Button>
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

            <TableContainer sx = {{
                maxHeight: "35vh",
                overflowY: "auto",
            }}>
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
