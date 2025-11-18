
import { Box } from '@mui/material';
import MinhaConta from '../components/User/MinhaConta';
import Seguranca from '../components/User/Seguranca';
import Sair from '../components/User/Sair';

export default function User() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <MinhaConta />
      <Seguranca />
      <Sair />
    </Box>
  );
}
