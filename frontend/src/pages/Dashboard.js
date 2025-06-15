import React from 'react';
import Box from "@mui/material/Box";
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import ActivityGraph from "../components/ActivityGraph";
import Footer from "../components/Footer";
import FavEventTable from "../components/FavEventTable";
import DashboardEventTable from "../components/DashboardEventTable";

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            // 1. Fetch top 5 events
            const response = await axios.get("http://localhost/email_scraper/Backend/Auth/Database/fetch_scrape_results.php?limit=5&sortBy=meeting_time");
            const topEvents = response.data.map((item) => ({
                id: item.message_ID,
                name: item.meeting_title,
                sender: item.sender,
                sendDate: item.send_date,
                location: item.meeting_location,
                datetime: item.meeting_time,
                cc: item.cc,
                bcc: item.bcc,
            }));
            setEvents(topEvents);

            // 2. Fetch voted events with full data
            const votesResponse = await axios.get("http://localhost/email_scraper/Backend/Events/get_user_votes.php", {
                withCredentials: true
            });

            const voted = votesResponse.data.map((item) => ({
                id: item.message_ID,
                name: item.meeting_title,
                sender: item.sender,
                sendDate: item.send_date,
                location: item.meeting_location,
                datetime: item.meeting_time,
                cc: item.cc,
                bcc: item.bcc,
            }));

            setSelectedEvents(voted);
            setSelectedIds(voted.map(e => e.id));
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

                setSelectedIds((prev) => {
                    const newIds = interested ? [...prev, eventId] : prev.filter((id) => id !== eventId);
                    return [...new Set(newIds)];
                });

                if (interested) {
                    // Try to find in top 5 first
                    const newEvent = events.find(e => e.id === eventId);
                    if (newEvent && !selectedEvents.some(e => e.id === eventId)) {
                        setSelectedEvents(prev => [...prev, newEvent]);
                    }
                } else {
                    setSelectedEvents(prev => prev.filter(e => e.id !== eventId));
                }
            } catch (error) {
                console.error("Vote failed", error);
            }
        }, [events, selectedEvents]
    );


    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f4f7fe', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <ActivityGraph />
                <FavEventTable selectedData={selectedEvents}/>
            </Box>
            <DashboardEventTable data={events} selectedIds={selectedIds} onToggleVote={toggleVote} />
            <Footer />
        </Box>
    )
}