
import { Box } from '@mui/material';
import ProgressSidebar from '../../components/Practice/PracticeMarcar/ProgressSidebar'; // Reusing the sidebar
import PracticeSelecionarContent from '../../components/Practice/Selecionar/PracticeSelecionarContent';

export default function PracticeSelecionar() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProgressSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <PracticeSelecionarContent />
      </Box>
    </Box>
  );
}
