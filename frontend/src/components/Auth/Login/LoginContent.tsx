
import { Box, Typography, TextField, Button, Link, CircularProgress, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoEnglishVerse from '../../../assets/englishverse-sem-fundo.png';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function LoginContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', {
                email: email,
                senha: password,
            });
            
            const { token } = response.data;
            login(token); // Use the login function from AuthContext
            
            navigate('/'); // Redirect to home page on successful login

        } catch (err) {
            setError('E-mail ou senha inválidos. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
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

            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>
                    E-mail
                </Typography>
                <TextField
                    fullWidth
                    placeholder="seuemail@ifpe.edu.br"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {/* <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Link href="#" onClick={handleForgotPassword} sx={{ color: '#007aff', textDecoration: 'none' }}>
                        Esqueceu sua senha?
                    </Link>
                </Box> */}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ bgcolor: '#007aff', color: 'white', py: 1.5, borderRadius: '14px', textTransform: 'uppercase', fontSize: '1rem', mb: 3 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
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
