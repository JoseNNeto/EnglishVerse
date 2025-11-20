
import { Box } from '@mui/material';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionPostagemContent from '../../components/Production/Postagem/ProductionPostagemContent';

export default function ProductionPostagem() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <ProductionPostagemContent />
      </Box>
    </Box>
  );
}
