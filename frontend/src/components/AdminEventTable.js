import React, {useEffect, useState} from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import axios from "axios";

const columnHelper = createColumnHelper();

export default function AdminEventTable() {
    const [events, setEvents] = useState([]);

    const [open, setOpen] = useState(false);
    const [currEvent, setCurrEvent] = useState(null);
    const [newDateTime, setNewDateTime] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleOpen = (event) => {
        setCurrEvent(event);
        setNewDateTime(event.datetime);
        setNewLocation(event.location);
        setError("");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrEvent(null);
        setError("");
    }

    const handleDelete = async () => {
        if (!currEvent) return;
        const confirm = window.confirm("Are you sure you want to delete this event?");
        if (!confirm) return;

        setLoading(true);
        try{
            const formData = new URLSearchParams();
            formData.append("event_id", currEvent.id);

            const response = await axios.post("http://localhost/email_scraper/Backend/Events/delete_event.php", formData, {
                withCredentials: true
            });
            if (response.status === 200 && response.data.includes("successfully")) {
                // Remove from state
                setEvents((prev) => prev.filter((e) => e.id !== currEvent.id));
                handleClose();
            } else {
                setError("Failed to delete event.");
            }
        } catch (err) {
            setError("Failed to delete event.");
        }
        setLoading(false);
    }

    const handleSave = async () => {
        if (!newDateTime && !newLocation) {
            setError("Please enter date/time or location");
            return;
        }

        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append("event_id", currEvent.id);
            const formatDateTime = (dt) => {
                if (!dt) return "";
                return dt.replace('T', ' ') + ":00";
            };
            if (newDateTime) formData.append("meeting_time", formatDateTime(newDateTime));
            if (newLocation) formData.append("meeting_location", newLocation);

            const response = await axios.post(
                "http://localhost/email_scraper/Backend/Events/update_event.php",
                formData,
                { withCredentials: true }
            );

            const formattedDateTime = newDateTime ? formatDateTime(newDateTime) : null;
            if (response.status === 200) {
                // Update local state
                setEvents((prev) =>
                    prev.map((e) =>
                        e.id === currEvent.id
                            ? { ...e, datetime: formattedDateTime , location: newLocation }
                            : e
                    )
                );
                handleClose();
            } else {
                setError("Failed to update event.");
            }
        } catch (err) {
            setError("Failed to update event.");
        }
        setLoading(false);
    };


    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const response = await axios.get("http://localhost/email_scraper/Backend/Auth/Database/fetch_scrape_results.php?sortBy=meeting_time");
                setEvents(response.data.map((item) => ({
                    id: item.message_ID,
                    name: item.meeting_title,
                    sender: item.sender,
                    sendDate: item.send_date,
                    location: item.meeting_location,
                    datetime: item.meeting_time,
                    cc: item.cc,
                    bcc: item.bcc,
                })));
            } catch (error) {
                console.error("Failed to fetch events: ", error);
            }
        };
        fetchEvents();
    }, []);


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
        columnHelper.accessor('datetime', {
            id: 'datetime',
            header: () => (
                <Typography variant="caption" color="textSecondary">
                    DATE & TIME
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
        columnHelper.display( {
            id: 'update',
            cell: ({ row }) => {
                const event = row.original;
                return (
                    <IconButton
                        color="primary"
                        onClick={() => handleOpen(event)}
                        aria-label="edit event"
                    >
                        <EditIcon />
                    </IconButton>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: events,
        columns,
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginLeft={1} >
                <Typography variant="h5" fontWeight="bold">
                    Manage Events
                </Typography>
            </Box>

            <TableContainer sx = {{
                maxHeight: "50vh",
                overflowY: "auto",
            }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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

            {/* Modal */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Event</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} minWidth={300} marginTop={1}>
                        <TextField
                            label="Date & Time"
                            type="datetime-local"
                            value={newDateTime}
                            onChange={(e) => setNewDateTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3, marginBottom: 2 }}>
                    <Button onClick={handleDelete} variant="contained" color="error" disabled={loading} >
                        Delete
                    </Button>
                    <Box>
                        <Button onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} variant="contained" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}