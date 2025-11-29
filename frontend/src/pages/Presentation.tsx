import { Box } from '@mui/material';
import SideBar from '../components/Presentation/SideBar';
import MidiaAndTranscption from '../components/Presentation/MidiaAndTranscption';
import Descrition from '../components/Presentation/Descrition';
import ModuleItemViewer from '../components/Presentation/ModuleItemViewer';
import { useParams } from 'react-router-dom';
import { ModuleProvider } from '../contexts/ModuleContext';

export default function Presentation() {
  const { id } = useParams<{ id: string }>();

  // Ensure id is available before rendering the provider
  if (!id) {
    return <Box>Carregando...</Box>; // Or some other loading/error state
  }

  return (
    <ModuleProvider moduloId={id}>
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ModuleItemViewer />
          <Descrition />
        </Box>
      </Box>
    </ModuleProvider>
  );
}
