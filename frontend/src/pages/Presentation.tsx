import { Box, LinearProgress, Button, Typography } from '@mui/material';
import SideBar from '../components/Presentation/SideBar';
import Descrition from '../components/Presentation/Descrition';
import ModuleItemViewer from '../components/Presentation/ModuleItemViewer';
import { useParams } from 'react-router-dom';
import { ModuleProvider, useModule } from '../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function PresentationContent() {
  const { loading, allItems, completedItems, activeItem, handleNextItem } = useModule();

  const progressValue = allItems.length > 0 
    ? (completedItems.length / allItems.length) * 100 
    : 0;

  const isLastItem = activeItem 
    ? allItems.findIndex(item => item.data.id === activeItem.data.id && item.type === activeItem.type) === allItems.length - 1
    : true;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <Typography color="white">Carregando módulo...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ mb: 2 }}> {/* Added Box for text and progress bar */}
          <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
            Progresso: {progressValue.toFixed(0)}%
          </Typography>
          <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 5, backgroundColor: '#333', '& .MuiLinearProgress-bar': { backgroundColor: '#007aff' } }} />
        </Box>
        <ModuleItemViewer />
        <Descrition />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
                variant="contained"
                onClick={handleNextItem}
                disabled={isLastItem}
                endIcon={<ArrowForwardIcon />}
                sx={{
                    backgroundColor: '#007aff',
                    '&:hover': { backgroundColor: '#005bb5' },
                    color: 'white',
                    fontWeight: 'bold',
                }}
            >
                Próximo
            </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function Presentation() {
  const { id } = useParams<{ id: string }>();

  // Ensure id is available before rendering the provider
  if (!id) {
    return <Box>Carregando...</Box>; // Or some other loading/error state
  }

  return (
    <ModuleProvider moduloId={id}>
      <PresentationContent />
    </ModuleProvider>
  );
}
