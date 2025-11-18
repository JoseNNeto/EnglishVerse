
import { Box } from '@mui/material';
import SideBar from '../components/Presentation/SideBar';
import MidiaAndTranscption from '../components/Presentation/MidiaAndTranscption';
import Descrition from '../components/Presentation/Descrition';

export default function Presentation() {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <MidiaAndTranscption />
        <Descrition />
      </Box>
    </Box>
  );
}
