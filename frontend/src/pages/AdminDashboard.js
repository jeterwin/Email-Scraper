import Box from "@mui/material/Box";
import UserTable from "../components/UserTable";
import Footer from "../components/Footer";
import AdminEventTable from "../components/AdminEventTable";
import InfoBox from "../components/InfoBox";
import axios from "axios";
import {useEffect, useState} from "react";
import PopularEvents from "../components/PopularEvents";

export default function AdminDashboard() {
    const [userCount, setUserCount] = useState(null);
    const [eventCount, setEventCount] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost/email_scraper/Backend/Auth/Database/get_total_accounts.php", {
            withCredentials: true
        })
        .then(res => setUserCount(res.data.total_accounts))
        .catch(() => setError("Failed to load user count"));
    }, [])

    useEffect(() => {
        axios.get("http://localhost/email_scraper/Backend/Auth/Database/get_total_events.php", {
            withCredentials: true
        })
            .then(res => setEventCount(res.data.event_count))
            .catch(() => setError("Failed to load event count"));
    }, [])

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f4f7fe', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "column", marginTop: "2%", marginLeft: "2%" }}>
                    <InfoBox title="Total Accounts" value={userCount} error={error} />
                    <InfoBox title="Ongoing Events" value={eventCount} error={error} />
                </Box>
                <UserTable />
                <PopularEvents />
            </Box>
            <AdminEventTable />
            <Footer />
        </Box>
    )
}