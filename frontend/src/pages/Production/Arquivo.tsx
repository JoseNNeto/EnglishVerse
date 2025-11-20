
import { Box } from '@mui/material';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionArquivoContent from '../../components/Production/Arquivo/ProductionArquivoContent';

export default function ProductionArquivo() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <ProductionArquivoContent />
      </Box>
    </Box>
  );
}
