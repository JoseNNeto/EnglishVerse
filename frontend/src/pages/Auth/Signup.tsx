
import { Box } from '@mui/material';
import SignupContent from '../../components/Auth/Signup/SignupContent';

export default function Signup() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', py: 5 }}>
      <SignupContent />
    </Box>
  );
}
