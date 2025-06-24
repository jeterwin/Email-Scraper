import React from "react";
import { Paper, Typography } from "@mui/material";

export default function InfoBox({ title, value, error }) {
    return (
        <Paper sx={{
            p: 5,
            minWidth: 280,
            textAlign: "center",
            borderRadius: "20px",
            margin: "0 2%",
            marginBottom: "5%",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            backgroundColor: "white" }}
        >
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Typography variant="h3" color="success" fontWeight="bold">
                    {value}
                </Typography>
            )}
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
        </Paper>
    )
}