import React, {useCallback, useEffect, useState} from 'react';
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import FullEventTable from "../components/FullEventTable";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";


export default function EventPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
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
            const votesResponse = await axios.get("http://localhost/email_scraper/Backend/Events/get_user_votes.php",
                { withCredentials: true }
            );

            const votedIds = votesResponse.data.map((item) => item.message_ID);
            setSelectedIds(votedIds);
        };
        fetchEvents();
    }, []);

    const toggleVote = useCallback(
        async (eventId, interested) => {
            try {
                const params = new URLSearchParams();
                params.append("event_id", eventId);
                params.append("interested", interested ? "1" : "0");
                console.log(params.toString());
                const response = await axios.post("http://localhost/email_scraper/Backend/Events/vote_event.php",
                    params.toString(),
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                    });

                console.log("Server response:", response.data);  // <-- Log PHP echo here

                setSelectedIds((prev) => interested ? [...prev, eventId] : prev.filter((id) => id !== eventId));
            } catch (error) {
                console.error("Vote failed", error);
            }
        }, []
    );

    return (
        <>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f4f7fe', minHeight: '100vh', p: 2 }}>
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: -2, alignSelf: 'flex-start', color: 'black' }}
                >
                        Back
                </Button>
                <FullEventTable data={events} selectedIds={selectedIds} onToggleVote={toggleVote}/>
                <Footer />
            </Box>
        </>
    );
}