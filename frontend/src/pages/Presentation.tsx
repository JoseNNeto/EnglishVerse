import { Box, LinearProgress, Button, Typography } from '@mui/material';
import SideBar from '../components/Presentation/SideBar';
import Descrition from '../components/Presentation/Descrition';
import ModuleItemViewer from '../components/Presentation/ModuleItemViewer';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleProvider, useModule } from '../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function PresentationContent() {
  const { loading, allItems, completedItems, activeItem, handleNextItem, moduloId } = useModule();
  const { user } = useAuth();
  const navigate = useNavigate();

  const progressValue = allItems.length > 0 
    ? (completedItems.length / allItems.length) * 100 
    : 0;
  
  const isModuleComplete = allItems.length > 0 && completedItems.length >= allItems.length;

  const handleConcluirModulo = async () => {
    if (!user || !moduloId) return;
    try {
      await api.put(`/progresso/concluir?alunoId=${user.id}&moduloId=${moduloId}`);
      navigate('/');
    } catch (error) {
      console.error("Failed to complete module", error);
      // Optionally, show an error message to the user
    }
  };

  const isLastItem = activeItem 
    ? allItems.findIndex(item => item.data.id === activeItem.data.id && item.type === activeItem.type) === allItems.length - 1
    : false;

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
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
            Progresso: {progressValue.toFixed(0)}%
          </Typography>
          <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 5, backgroundColor: '#333', '& .MuiLinearProgress-bar': { backgroundColor: '#007aff' } }} />
        </Box>
        <ModuleItemViewer />
        <Descrition />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {isModuleComplete ? (
              <Button
                variant="contained"
                onClick={handleConcluirModulo}
                endIcon={<CheckCircleIcon />}
                sx={{
                    backgroundColor: 'green',
                    '&:hover': { backgroundColor: 'darkgreen' },
                    color: 'white',
                    fontWeight: 'bold',
                }}
              >
                Concluir Módulo
              </Button>
            ) : (
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
            )}
        </Box>
      </Box>
    </Box>
  );
}

export default function Presentation() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Box>Carregando...</Box>;
  }

  return (
    <ModuleProvider moduloId={id}>
      <PresentationContent />
    </ModuleProvider>
  );
}
