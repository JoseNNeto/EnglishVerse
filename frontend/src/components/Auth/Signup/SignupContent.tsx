
import { Box, Typography, TextField, Button, Link, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EventIcon from '@mui/icons-material/Event';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoEnglishVerse from '../../../assets/englishverse-sem-fundo.png';

export default function SignupContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const handleToggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);
    
    const handleSignup = () => {
        // Implement signup logic here
        console.log('Signup clicked');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#282828',
            borderRadius: '14px',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused fieldset': { borderColor: '#007aff' },
        },
        '& .MuiInputBase-input': { color: '#e0e0e0' },
        '& input::placeholder': { color: '#b3b3b3', opacity: 1 },
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
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
            }}
        >
            <Box
                component="img"
                src={LogoEnglishVerse}
                alt="Englishverse Logo"
                sx={{ width: 150, height: 'auto', mb: 2 }}
            />
            <Typography variant="h5" sx={{ color: '#e0e0e0', mb: 3 }}>
                Crie sua conta
            </Typography>

            <Box component="form" sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>Nome completo</Typography>
                <TextField fullWidth placeholder="Seu nome completo" variant="outlined" sx={{ ...inputStyles, mb: 2 }} />

                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>E-mail</Typography>
                <TextField fullWidth placeholder="seuemail@ifpe.edu.br" variant="outlined" sx={{ ...inputStyles, mb: 2 }} />
                
                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>Data de nascimento</Typography>
                <TextField
                    fullWidth
                    type="date"
                    variant="outlined"
                    sx={{ ...inputStyles, mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                />

                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>Senha</Typography>
                <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityIcon sx={{ color: '#b3b3b3' }} /> : <VisibilityOffIcon sx={{ color: '#b3b3b3' }} />}
                            </IconButton>
                        ),
                    }}
                    sx={{ ...inputStyles, mb: 2 }}
                />

                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>Confirmar senha</Typography>
                <TextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Digite a senha novamente"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                                {showConfirmPassword ? <VisibilityIcon sx={{ color: '#b3b3b3' }} /> : <VisibilityOffIcon sx={{ color: '#b3b3b3' }} />}
                            </IconButton>
                        ),
                    }}
                    sx={{ ...inputStyles, mb: 3 }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: '#007aff', color: 'white', py: 1.5, borderRadius: '14px', textTransform: 'uppercase', fontSize: '1rem', mb: 3 }}
                    onClick={handleSignup}
                >
                    Criar conta
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#b3b3b3', display: 'inline' }}>
                        Já tem uma conta?{' '}
                    </Typography>
                    <Link href="#" onClick={handleLogin} sx={{ color: '#007aff', textDecoration: 'none' }}>
                        Faça login aqui
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
