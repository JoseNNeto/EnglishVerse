
import { Box } from '@mui/material';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionSubstituirContent from '../../components/Production/Substituir/ProductionSubstituirContent';

export default function ProductionSubstituir() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <ProductionSubstituirContent />
      </Box>
    </Box>
  );
}
