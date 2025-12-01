
import { Box } from '@mui/material';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionOuvirCompletarContent from '../../components/Production/OuvirCompletar/ProductionOuvirCompletarContent';

export default function ProductionOuvirCompletar() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <ProductionOuvirCompletarContent />
      </Box>
    </Box>
  );
}
