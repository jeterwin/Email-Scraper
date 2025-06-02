import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
}));

export default function LogInCard() {
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = async(event) => {
        event.preventDefault();

        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);
        const payload = new URLSearchParams({
            username: data.get('name'),
            password: data.get('password'),
            role: data.get('role'),
        });

        try {
            const response = await fetch('http://localhost/email_scraper/Backend/Auth/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: payload,
                credentials: 'include',
            });
            const result = await response.text();

            if (result.startsWith("Success:")) {
                const role = result.split(':')[1];
                const username = String(data.get('name'));
                localStorage.setItem('username', username);

                if (role === 'user') {
                    navigate('/dashboard');
                } else if (role === 'admin'){
                    navigate('/adminDashboard');
                }
            } else {
                alert(result);
            }
        } catch (error) {
            console.error('Login error', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    const validateInputs = () => {
        const name = document.getElementById('name');
        const password = document.getElementById('password');

        let isValid = true;

        if (!name.value || name.value.includes(' ')){
            setNameError(true);
            setNameErrorMessage(!name.value ? 'Please enter your username.' : 'Username cannot contain spaces.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        if (!password.value || password.value.length < 6 || password.value.includes(' ')) {
            setPasswordError(true);
            if (!password.value) {
                setPasswordErrorMessage('Please enter a password.');
            } else if (password.value.length < 6) {
                setPasswordErrorMessage('Password must be at least 6 characters long.');
            } else {
                setPasswordErrorMessage('Password cannot contain spaces.');
            }isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <Card variant="">
            <Typography
                component="h1"
                variant="h1"
                sx={{ width: '100%', fontSize: 'clamp(3rem, 10vw, 3.15rem)', fontWeight: 'bold', textAlign: 'center' }}
            >
                Log In
            </Typography>
            <Typography
                component="p"
                variant="h4"
                sx={{ width: '100%' , fontSize: 'clamp(1rem, 10vw, 1.15rem)', textAlign: 'center', paddingBottom: '1.15rem' }}
            >
                Welcome back! We're happy to see you!
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="name">Username</FormLabel>
                    <TextField
                        error={nameError}
                        helperText={nameErrorMessage}
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your username"
                        autoFocus
                        required
                        fullWidth
                        variant='outlined'
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="••••••"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleTogglePassword}
                                        edge="end"
                                        aria-label="toggle password"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', gap:'5px', paddingBottom: '1.5rem' }}>
                        <Typography variant="body2">
                            Don't have an account?
                        </Typography>
                        <Box component={Link} to="/" sx={{
                                fontFamily: 'Arial',
                                fontSize: '14px',
                                textDecoration: 'none',
                                color: 'blue',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            Sign Up
                        </Box>
                    </Box>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        height: '7vh',
                        fontSize: '1.15rem',
                        fontWeight: 'medium',
                        background: '#14ae5c',
                    }}>
                    Login
                </Button>
            </Box>
        </Card>
    );
}
