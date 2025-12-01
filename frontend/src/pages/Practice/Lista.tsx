
import { Box } from '@mui/material';
import ProgressSidebar from '../../components/Practice/PracticeMarcar/ProgressSidebar'; // Reusing the sidebar
import PracticeListaContent from '../../components/Practice/Lista/PracticeListaContent';

export default function PracticeLista() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProgressSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <PracticeListaContent />
      </Box>
    </Box>
  );
}
