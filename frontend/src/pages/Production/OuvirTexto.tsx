
import { Box } from '@mui/material';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionOuvirTextoContent from '../../components/Production/OuvirTexto/ProductionOuvirTextoContent';

export default function ProductionOuvirTexto() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <ProductionOuvirTextoContent />
      </Box>
    </Box>
  );
}
