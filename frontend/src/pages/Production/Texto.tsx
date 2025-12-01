
import { Box } from '@mui/material';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionTextoContent from '../../components/Production/Texto/ProductionTextoContent';

export default function ProductionTexto() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <ProductionTextoContent />
      </Box>
    </Box>
  );
}
