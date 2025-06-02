import React from 'react';
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import FullEventTable from "../components/FullEventTable";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function EventPage() {
    const navigate = useNavigate();

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
                <FullEventTable />
                <Footer />
            </Box>
        </>
    );
}