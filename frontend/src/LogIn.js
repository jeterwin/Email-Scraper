import * as React from 'react';
import Stack from '@mui/material/Stack';
import Content from './components/Content';
import Box from "@mui/material/Box";
import LogInCard from "./components/LogInCard";

export default function LogIn() {
    return (
        <Stack
            direction="column"
            component="main"
            sx={[
                {
                    justifyContent: 'center',
                    height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
                    marginTop: 'max(1 - var(--template-frame-height, 0px), 0px)',
                    minHeight: '100%',
                },
                (theme) => ({
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        zIndex: -1,
                        inset: 0,
                        backgroundImage: 'fff'
                    },
                }),
            ]}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                    justifyContent: 'center',
                    gap: { xs: 6, sm: 12 },
                    p: { xs: 2, sm: 4 },
                    m: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: { xs: 'none', md: 'block' },
                    }}
                >
                    <Content />
                </Box>
                <LogInCard />
            </Stack>
        </Stack>
    );
}