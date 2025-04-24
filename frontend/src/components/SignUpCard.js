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

export default function SignUpCard() {
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        if (nameError || emailError || passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        console.log({
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    const validateInputs = () => {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const password = document.getElementById('password');


        let isValid = true;

        if (!name.value){
            setNameError(true);
            setNameErrorMessage('Please enter your name');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
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
                Sign Up
            </Typography>
            <Typography
                component="p"
                variant="h4"
                sx={{ width: '100%' , fontSize: 'clamp(1rem, 10vw, 1.15rem)', textAlign: 'center', paddingBottom: '1.15rem' }}
            >
                Welcome! - Let's create an account
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <TextField
                        error={nameError}
                        helperText={nameErrorMessage}
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        autoFocus
                        required
                        fullWidth
                        variant='outlined'
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={emailError ? 'error' : 'primary'}
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
                        autoFocus
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
                            Already have an account?
                        </Typography>
                        <Box component={Link} to="/login" sx={{
                                fontFamily: 'Arial',
                                fontSize: '14px',
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            Log In
                        </Box>
                    </Box>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        if (validateInputs()) {
                            navigate('/dashboard');
                        }
                    }}
                    sx={{
                        textTransform: 'none',
                        height: '7vh',
                        fontSize: '1.15rem',
                        fontWeight: 'medium',
                        background: '#14ae5c',
                    }}>
                    Create Account
                </Button>
            </Box>
        </Card>
    );
}
