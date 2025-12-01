import { Box, Typography, TextField, Button, Link, IconButton, CircularProgress, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoEnglishVerse from '../../../assets/englishverse-sem-fundo.png';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function SignupContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const handleToggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);
    
    const validatePassword = (pwd: string): string => {
        if (pwd.length < 8) {
            return 'A senha deve ter no mínimo 8 caracteres.';
        }
        if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(pwd)) {
            return 'A senha deve conter pelo menos um caractere especial.';
        }
        return '';
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordError(validatePassword(newPassword));
    };

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        const validationError = validatePassword(password);
        if (validationError) {
            setPasswordError(validationError);
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/usuarios', {
                nome: nome,
                email: email,
                senha: password,
            });
            
            const { token } = response.data;
            login(token);
            
            navigate('/');

        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Não foi possível realizar o cadastro. Verifique os dados e tente novamente.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
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

            <Box component="form" onSubmit={handleSignup} sx={{ width: '100%' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>Nome completo</Typography>
                <TextField fullWidth placeholder="Seu nome completo" variant="outlined" sx={{ ...inputStyles, mb: 2 }} value={nome} onChange={(e) => setNome(e.target.value)} required />

                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>E-mail</Typography>
                <TextField fullWidth placeholder="seuemail@ifpe.edu.br" variant="outlined" sx={{ ...inputStyles, mb: 2 }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                
                <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>Senha</Typography>
                <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres, 1 especial"
                    variant="outlined"
                    value={password}
                    onChange={handlePasswordChange}
                    error={!!passwordError}
                    helperText={passwordError}
                    required
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityIcon sx={{ color: '#b3b3b3' }} /> : <VisibilityOffIcon sx={{ color: '#b33' }} />}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
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
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || !!passwordError || !nome || !email || !password || !confirmPassword}
                    sx={{ bgcolor: '#007aff', color: 'white', py: 1.5, borderRadius: '14px', textTransform: 'uppercase', fontSize: '1rem', mb: 3 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar conta'}
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