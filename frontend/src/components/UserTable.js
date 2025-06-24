import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

const columnHelper = createColumnHelper();

export default function UserTable() {
    const [sorting, setSorting] = React.useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost/email_scraper/Backend/Auth/Database/fetch_users.php', {
                    withCredentials: true,
                });
                const mappedData = response.data.map(item => ({
                    id: item.ID,
                    username: item.username,
                    email: item.email,
                    role: item.role,
                }));
                setTableData(mappedData);
            } catch (error) {
                console.error('Failed to fetch all data:', error);
            }
        }

        fetchData();
    }, []);

    const columns = [
        columnHelper.display( {
            id: 'delete',
            cell: ({ row }) => {
                const user = row.original;
                if (user.role === "admin") {
                    return null;
                }

                const handleDelete = async () => {
                    const confirmed = window.confirm("Are you sure you want to delete this user?");
                    if (!confirmed) return;

                    try{
                        const response = await fetch("http://localhost/email_scraper/Backend/Auth/delete_user.php", {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({ user_id: user.id }),
                            credentials: "include",
                        });
                        const message = await response.text();
                        console.log(message)

                        if (response.ok){
                            setTableData(prev =>
                                prev.filter(u => u.id !== user.id)
                            );
                        } else {
                            console.error("Deletion failed: ", message);
                        }
                    } catch (error){
                        console.error("Error deleting user: ", error);
                    }
                };

                return (
                    <IconButton
                        color="error"
                        size="small"
                        onClick={handleDelete}
                    >
                        <DeleteIcon />
                    </IconButton>
                );
            },
        }),
        columnHelper.accessor('username', {
            id: 'username',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    USERNAME
                </Typography>
            ),
            cell: (info) => {
                return (
                    <Box display="flex" alignItems="center">
                        <Typography variant="body2">
                            {info.getValue()}
                        </Typography>
                    </Box>
                );
            },
        }),
        columnHelper.accessor('email', {
            id: 'email',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    EMAIL
                </Typography>
            ),
            cell: (info) => (
                <Typography variant="body2">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('role', {
            id: 'role',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    ROLE
                </Typography>
            ),
            cell: (info) => (
                <Typography variant="body2">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.display( {
            id: 'promotion',
            cell: ({ row }) => {
                const user = row.original;
                if (user.role === "admin") {
                    return null;
                }

                const handlePromote = async () => {
                    try{
                        const response = await fetch("http://localhost/email_scraper/Backend/Auth/promote.php", {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({ user_id: user.id }),
                            credentials: "include",
                        });
                        const message = await response.text();
                        console.log(message)

                        if (response.ok){
                            setTableData(prev =>
                                prev.map(u =>
                                    u.id === user.id ? { ...u, role: 'admin' } : u
                                )
                            );
                        } else {
                            console.error("Promotion failed: ", message);
                        }
                    } catch (error){
                        console.error("Error promoting user: ", error);
                    }
                };

                return (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handlePromote}
                    >
                        Promote
                    </Button>
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
        getRowId: (row) => row.id,
    });

    return (
        <Paper elevation={0} sx={{
            p: 2,
            width: "45%",
            borderRadius: "20px",
            margin: "0 2%",
            marginTop: "2%",
            marginBottom: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            backgroundColor: "white",
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginLeft={1} >
                <Typography variant="h5" fontWeight="bold">
                    Manage Users
                </Typography>
            </Box>

            <TableContainer sx = {{
                maxHeight: "40vh",
                overflowY: "auto",
            }}>
                <Table size="small" stickyHeader>
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
                                    <TableCell key={cell.id} sx={{ height: 45 }}>
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