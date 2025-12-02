
import { Box } from '@mui/material';
import PracticeSubstituirContent from '../../components/Practice/Substituir/PracticeSubstituirContent';

export default function PracticeSubstituir() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <PracticeSubstituirContent />
      </Box>
    </Box>
  );
}
