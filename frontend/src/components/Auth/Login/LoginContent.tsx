
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoEnglishVerse from '../../../assets/englishverse-sem-fundo.png';

export default function LoginContent() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = () => {
        // Implement login logic here
        console.log('Login clicked');
    };

    const handleForgotPassword = () => {
        // Implement forgot password logic here
        console.log('Forgot password clicked');
    };

    const handleSignUp = () => {
        navigate('/signup'); // Assuming a signup route exists
    };

    return (
        <Box
            sx={{
                bgcolor: '#1a1a1a',
                borderRadius: '14px',
                width: 400,
                p: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)', // Added a subtle shadow for depth
            }}
        >
            <Box
                component="img"
                src={LogoEnglishVerse} // Assuming this path is correct based on folder structure
                alt="Englishverse Logo"
                sx={{ width: 150, height: 'auto', mb: 3 }}
            />
            <Typography variant="h5" sx={{ color: '#e0e0e0', mb: 3 }}>
                Bem-vindo de volta!
            </Typography>

            <Box component="form" sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>
                    E-mail
                </Typography>
                <TextField
                    fullWidth
                    placeholder="seuemail@ifpe.edu.br"
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#282828',
                            borderRadius: '14px',
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: 'transparent',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#007aff',
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: '#e0e0e0',
                        },
                        '& input::placeholder': {
                            color: '#b3b3b3',
                            opacity: 1,
                        },
                    }}
                />

                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>
                    Senha
                </Typography>
                <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <Button
                                onClick={handleTogglePasswordVisibility}
                                sx={{ minWidth: 0, p: 0 }}
                            >
                                {showPassword ? <VisibilityIcon sx={{ color: '#b3b3b3' }} /> : <VisibilityOffIcon sx={{ color: '#b3b3b3' }} />}
                            </Button>
                        ),
                    }}
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#282828',
                            borderRadius: '14px',
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: 'transparent',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#007aff',
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: '#e0e0e0',
                        },
                        '& input::placeholder': {
                            color: '#b3b3b3',
                            opacity: 1,
                        },
                    }}
                />

                <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Link href="#" onClick={handleForgotPassword} sx={{ color: '#007aff', textDecoration: 'none' }}>
                        Esqueceu sua senha?
                    </Link>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: '#007aff', color: 'white', py: 1.5, borderRadius: '14px', textTransform: 'uppercase', fontSize: '1rem', mb: 3 }}
                    onClick={handleLogin}
                >
                    Entrar
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#b3b3b3', display: 'inline' }}>
                        Não tem uma conta?{' '}
                    </Typography>
                    <Link href="#" onClick={handleSignUp} sx={{ color: '#007aff', textDecoration: 'none' }}>
                        Cadastre-se aqui
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
