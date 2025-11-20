
import { Box } from '@mui/material';
import ProgressSidebar from '../../components/Practice/PracticeMarcar/ProgressSidebar'; // Reusing the sidebar
import PracticeCompletarContent from '../../components/Practice/Completar/PracticeCompletarContent';

export default function PracticeCompletar() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProgressSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <PracticeCompletarContent />
      </Box>
    </Box>
  );
}
