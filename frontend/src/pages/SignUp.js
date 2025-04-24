import * as React from 'react';
import Stack from '@mui/material/Stack';
import SignUpCard from '../components/SignUpCard';
import Content from '../components/Content';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Box from "@mui/material/Box";

export default function SignUp() {
    const location = useLocation();
    const isSignUp = location.pathname === '/';
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
                }}
            >
                <SignUpCard />
                <motion.div
                    initial={{ x: isSignUp ? -200 : 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: isSignUp ? 200 : -200, opacity: 0 }}
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

            </Stack>
        </Stack>
    );
}