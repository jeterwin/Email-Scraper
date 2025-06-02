import React from 'react';
import { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import RoleToggle from "../components/RoleToggle";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/Dashboard"
import AdminDashboard from "../pages/AdminDashboard"

export default function Admin() {
    const [role, setRole] = useState(() => {
        const savedRole = localStorage.getItem('userRole');
        return savedRole === 'user' ? 'user' : 'admin';
    });

    useEffect(() => {
        localStorage.setItem('userRole', role);
    }, [role]);

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f4f7fe', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', paddingTop: '64px' }}>
            <Navbar />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box textAlign="center">
                    <RoleToggle role={role} setRole={setRole} />
                </Box>
            </Box>
            <Box>
                {role === 'admin' ? <AdminDashboard /> : <Dashboard />}
            </Box>
        </Box>
    )
}