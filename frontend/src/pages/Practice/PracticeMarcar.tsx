
import { Box } from '@mui/material';
import ProgressSidebar from '../../components/Practice/PracticeMarcar/ProgressSidebar';
import PracticeContent from '../../components/Practice/PracticeMarcar/PracticeContent';

export default function PracticeMarcar() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProgressSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <PracticeContent />
      </Box>
    </Box>
  );
}
