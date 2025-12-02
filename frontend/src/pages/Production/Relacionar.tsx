
import { Box } from '@mui/material';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionRelacionarContent from '../../components/Production/Relacionar/ProductionRelacionarContent';

export default function ProductionRelacionar() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <ProductionRelacionarContent />
      </Box>
    </Box>
  );
}
