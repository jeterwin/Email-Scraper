import * as React from 'react';
import Stack from '@mui/material/Stack';
import Content from '../components/Content';
import Box from "@mui/material/Box";
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import LogInCard from "../components/LogInCard";

export default function LogIn() {
    const location = useLocation();
    const isLogin = location.pathname === '/login';
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
                    position: 'relative',
                    overflow: 'hidden',
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
                    alignItems: 'center',
                }}
            >
                <motion.div
                    initial={{ x: isLogin ? 200 : -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: isLogin ? -200 : 200, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'block' },
                        }}
                    >
                        <Content />
                    </Box>
                </motion.div>
                <LogInCard />
            </Stack>
        </Stack>
    );
}