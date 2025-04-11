import React from "react";
import Box from "@mui/material/Box";
import background from '../background.jpg'

export default function Content() {
    return (
        <Box
            sx={{
                width: '38vw',
                height: '88vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <Box
                component="img"
                src={background}
                alt="background"
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: '50px',
                }}
            />
        </Box>
    )
}