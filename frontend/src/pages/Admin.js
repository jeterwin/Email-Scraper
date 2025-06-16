import React from 'react';
import { useState } from 'react';
import Box from "@mui/material/Box";
import Dashboard from "../pages/Dashboard"
import AdminDashboard from "../pages/AdminDashboard"
import ElevateAppBar from "../components/Navbar";
import RoleToggle from "../components/RoleToggle";

export default function Admin() {
    const [view, setView] = useState(() => {
        const savedView = localStorage.getItem('view');
        return savedView === 'user' ? 'user' : 'admin';
    })

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f4f7fe', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <ElevateAppBar roleToggle={<RoleToggle view={view} setView={setView} />}/>
            <Box>
                {view === 'admin' ? <AdminDashboard /> : <Dashboard />}
            </Box>
        </Box>
    )
}