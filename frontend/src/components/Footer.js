import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box
            sx={{
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: "30px",
                pb: "30px",
                marginTop: "2%",
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: "#a9b1bf",
                    textAlign: "center",
                    mb: "20px",
                }}
            >
                &copy; {1900 + new Date().getYear()}{" "}
                <Typography
                    component="span"
                    sx={{
                        fontWeight: 500,
                        ml: "4px",
                    }}
                >
                    MEAero. All Rights Reserved. Made with love ❤️
                </Typography>
            </Typography>
        </Box>
    );
}
