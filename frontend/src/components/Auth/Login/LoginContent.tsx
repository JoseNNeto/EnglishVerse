import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Link,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoEnglishVerse from '../../../assets/englishverse-sem-fundo.png';
import api from '../../../services/api';
import { useAuth, type UserProfile } from '../../../contexts/AuthContext';
import { useThemeMode } from '../../../contexts/ThemeContext';
import { appPalette } from '../../../theme/palette';

export default function LoginContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState<UserProfile>('DISCENTE');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { mode } = useThemeMode();
    const colors = appPalette[mode];

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', {
                email,
                senha: password,
                perfil: profile,
            });
            login(response.data.token);
            navigate(profile === 'DOCENTE' ? '/teacher-studio' : '/');
        } catch (err) {
            setError('E-mail, senha ou perfil inválido. Confira os dados e tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: colors.surfaceAlt,
            borderRadius: '14px',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: colors.border },
            '&.Mui-focused fieldset': { borderColor: colors.primary },
        },
        '& .MuiInputBase-input': { color: colors.text },
        '& input::placeholder': { color: colors.textMuted, opacity: 1 },
    };

    return (
        <Box sx={{
            bgcolor: colors.nav,
            borderRadius: '24px',
            width: { xs: 'calc(100vw - 32px)', sm: 440 },
            p: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.42)',
        }}>
            <Box component="img" src={LogoEnglishVerse} alt="EnglishVerse" sx={{ width: 150, mb: 2 }} />
            <Typography variant="h5" sx={{ color: colors.secondary, fontWeight: 900, textAlign: 'center' }}>
                Bem-vindo de volta
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textMuted, mb: 3, textAlign: 'center' }}>
                Escolha como você acessa o EnglishVerse.
            </Typography>

            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <ToggleButtonGroup
                    exclusive
                    fullWidth
                    value={profile}
                    onChange={(_, value) => value && setProfile(value)}
                    aria-label="Tipo de acesso"
                    sx={{
                        mb: 3,
                        gap: 1,
                        '& .MuiToggleButton-root': {
                            border: `1px solid ${colors.border} !important`,
                            borderRadius: '14px !important',
                            color: colors.textMuted,
                            textTransform: 'none',
                            py: 1.2,
                            gap: 1,
                        },
                        '& .Mui-selected': {
                            bgcolor: `${colors.primary}22 !important`,
                            color: `${colors.primary} !important`,
                        },
                    }}
                >
                    <ToggleButton value="DISCENTE"><SchoolOutlinedIcon /> Discente</ToggleButton>
                    <ToggleButton value="DOCENTE"><CoPresentOutlinedIcon /> Docente</ToggleButton>
                </ToggleButtonGroup>

                <Typography sx={{ color: colors.text, mb: 1 }}>E-mail institucional</Typography>
                <TextField
                    fullWidth
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={profile === 'DOCENTE'
                        ? 'nome.sobrenome@belojardim.ifpe.edu.br'
                        : 'seuemail@discente.ifpe.edu.br'}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    sx={inputStyles}
                />
                <Typography variant="caption" sx={{ display: 'block', color: colors.textMuted, mt: 0.75, mb: 2 }}>
                    {profile === 'DOCENTE'
                        ? 'Padrão docente: nome.sobrenome@belojardim.ifpe.edu.br'
                        : 'Padrão discente: seu e-mail acadêmico @discente.ifpe.edu.br'}
                </Typography>

                <Typography sx={{ color: colors.text, mb: 1 }}>Senha</Typography>
                <TextField
                    fullWidth
                    required
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <IconButton onClick={() => setShowPassword(value => !value)} aria-label="Exibir senha">
                                    {showPassword
                                        ? <VisibilityIcon sx={{ color: colors.textMuted }} />
                                        : <VisibilityOffIcon sx={{ color: colors.textMuted }} />}
                                </IconButton>
                            ),
                        },
                    }}
                    sx={{ ...inputStyles, mb: 3 }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ py: 1.5, borderRadius: '14px', textTransform: 'none', fontWeight: 900, mb: 3 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: colors.textMuted, display: 'inline' }}>
                        Não tem uma conta?{' '}
                    </Typography>
                    <Link component="button" type="button" onClick={() => navigate('/signup')} sx={{ color: colors.primary }}>
                        Cadastre-se aqui
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
