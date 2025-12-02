
import { Box } from '@mui/material';
import PracticeRelacionarContent from '../../components/Practice/Relacionar/PracticeRelacionarContent';

export default function PracticeRelacionar() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <PracticeRelacionarContent />
      </Box>
    </Box>
  );
}
