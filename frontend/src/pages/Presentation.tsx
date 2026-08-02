import { Box, LinearProgress, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Chip } from '@mui/material';
import SideBar from '../components/Presentation/SideBar';
import Descrition from '../components/Presentation/Descrition';
import ModuleItemViewer from '../components/Presentation/ModuleItemViewer';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleProvider, useModule } from '../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { ModuleCompletionResponse } from '../types/gamification';
import { useGamification } from '../contexts/GamificationContext';
import { useState } from 'react';
import { ActiveMediaClassification } from '../components/MediaClassification/MediaClassification';

function PresentationContent() {
  const { loading, allItems, completedItems, activeItem, handleNextItem, moduloId } = useModule();
  const navigate = useNavigate();
  const { refreshJourney } = useGamification();
  const [completion, setCompletion] = useState<ModuleCompletionResponse | null>(null);

  const progressValue = allItems.length > 0 
    ? (completedItems.length / allItems.length) * 100 
    : 0;
  
  const isModuleComplete = allItems.length > 0 && completedItems.length >= allItems.length;

  const handleConcluirModulo = async () => {
    if (!moduloId) return;
    try {
      const response = await api.put<ModuleCompletionResponse>(`/progresso/concluir?moduloId=${moduloId}`);
      setCompletion(response.data);
      await refreshJourney();
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
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: (theme) => theme.palette.mode === 'light' ? '#456379' : '#000000' }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
            Progresso: {progressValue.toFixed(0)}%
          </Typography>
          <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 5, backgroundColor: '#282828', '& .MuiLinearProgress-bar': { backgroundColor: '#a8c97f' } }} />
        </Box>
        {activeItem && <ActiveMediaClassification category={activeItem.data.mediaCategory} />}
        <ModuleItemViewer key={activeItem ? `${activeItem.type}-${activeItem.data.id}` : 'empty'} />
        <Descrition />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {isModuleComplete ? (
              <Button
                variant="contained"
                onClick={handleConcluirModulo}
                endIcon={<CheckCircleIcon />}
                sx={{
                    backgroundColor: '#a8c97f',
                    '&:hover': { backgroundColor: '#a8c97f' },
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
                      backgroundColor: '#75c3ff',
                      '&:hover': { backgroundColor: '#75c3ff' },
                      color: 'white',
                      fontWeight: 'bold',
                  }}
              >
                  Próximo
              </Button>
            )}
        </Box>
      </Box>
      <Dialog open={Boolean(completion)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        {completion && (
          <>
            <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
              <AutoAwesomeIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4">COMPLETED ORBIT!</Typography>
              <Typography variant="body2" color="text.secondary">{completion.moduleTitle}</Typography>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={1.2}>
                {[
                  ['Presentation', completion.breakdown.presentationXp],
                  ['Practice', completion.breakdown.practiceXp],
                  ['Production', completion.breakdown.productionXp],
                  ['Bônus da etapa Practice', completion.breakdown.practiceStageBonusXp],
                  ['Completed Orbit bonus', completion.breakdown.moduleBonusXp],
                ].map(([label, xp]) => (
                  <Stack key={String(label)} direction="row" justifyContent="space-between">
                    <Typography>{label}</Typography><Typography color="warning.main" fontWeight={800}>+{xp as number} XP</Typography>
                  </Stack>
                ))}
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Box><Typography variant="h6">Total do módulo</Typography><Typography variant="caption" color="text.secondary">XP acumulado ao longo desta órbita</Typography></Box>
                  <Typography variant="h6" color="warning.main">+{completion.breakdown.totalXp} XP</Typography>
                </Stack>
                {completion.reward.events.some(event => event.type === 'TOPIC_COMPLETED') && (
                  <Stack direction="row" justifyContent="space-between" sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.main', color: 'success.contrastText' }}>
                    <Typography fontWeight={800}>Constellation Conquered!</Typography>
                    <Typography fontWeight={900}>+{completion.reward.events.filter(event => event.type === 'TOPIC_COMPLETED').reduce((sum, event) => sum + event.xpAmount, 0)} XP</Typography>
                  </Stack>
                )}
                {completion.reward.unlockedAchievements.length > 0 && (
                  <Box sx={{ pt: 2 }}>
                    <Typography variant="overline" color="text.secondary">Nova conquista</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {completion.reward.unlockedAchievements.map(achievement => (
                        <Chip key={achievement.code} icon={<AutoAwesomeIcon />} label={achievement.name} color="success" />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => navigate('/user')}>Ver minha jornada</Button>
              <Button variant="contained" onClick={() => navigate('/')}>Voltar ao início</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
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
