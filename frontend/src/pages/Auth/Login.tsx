
import { Box } from '@mui/material';
import LoginContent from '../../components/Auth/Login/LoginContent';
import { useThemeMode } from '../../contexts/ThemeContext';
import { appPalette } from '../../theme/palette';

export default function Login() {
  const { mode } = useThemeMode();
  const colors = appPalette[mode];
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: `radial-gradient(circle at 15% 15%, ${colors.primary}22, transparent 34%), radial-gradient(circle at 90% 80%, ${colors.accent}22, transparent 30%), ${colors.background}`,
    }}>
      <LoginContent />
    </Box>
  );
}
