
import { Box } from '@mui/material';
import LoginContent from '../../components/Auth/Login/LoginContent';

export default function Login() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212' }}>
      <LoginContent />
    </Box>
  );
}
