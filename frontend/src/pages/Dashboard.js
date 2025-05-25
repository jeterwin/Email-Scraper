import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import EventTable from "../components/EventTable";
import ActivityGraph from "../components/ActivityGraph";
import Footer from "../components/Footer";
import FavEventTable from "../components/FavEventTable";

export default function Dashboard() {
    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f4f7fe', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar />
            <Box sx={{ display: "flex", direction: "row" }}>
                <ActivityGraph />
                <FavEventTable selectedEvents />
            </Box>
            <EventTable tableData showButton={true}/>
            <Footer />
        </Box>
    )
}