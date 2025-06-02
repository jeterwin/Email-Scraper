import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Box, Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar(props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: undefined,
    });

    return children
        ? React.cloneElement(children, {
            elevation: trigger ? 4 : 0,
        })
        : null;
}

export default function ElevateAppBar(props) {
    const [username, setUsername] = React.useState('');

    React.useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost/email_scraper/Backend/Auth/logout.php', {
                credentials: "include",
            });
            const result = await response.text();
            console.log(result);

            localStorage.clear();
            sessionStorage.clear();
            window.location.replace('/login');
        } catch (error) {
            console.log('Logout failed: ', error);
        }
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Navbar {...props}>
                <AppBar position='fixed' style={{ backgroundColor: 'white', boxShadow: 'none' }}>
                    <Toolbar >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', width: '100%' }}>
                            <Typography variant="h4" component="div" sx={{ color: 'black', fontWeight: 'bold', marginRight: '0.5rem' }}>
                                👋 Hello,{' '}
                                <Box component="span" sx={{ color: '#4B9460', fontWeight: 'bold' }}>
                                    {username}
                                </Box>
                                !
                            </Typography>
                            <Button
                                onClick={handleLogout}
                                variant="outlined"
                                color="error"
                                endIcon={<LogoutIcon />}
                                sx={{
                                    fontSize: '16px',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    borderColor: '#900B09',
                                    color: '#900B09',
                                    '&:hover': {
                                        backgroundColor: '#900B09',
                                        borderColor: '#900B09',
                                        color: 'white',
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Navbar>
            <Toolbar />
        </React.Fragment>
    );
}