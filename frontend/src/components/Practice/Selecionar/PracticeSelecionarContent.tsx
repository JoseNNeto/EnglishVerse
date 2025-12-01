import { Box, Typography, LinearProgress, Button, Paper, Chip, CircularProgress } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useState } from 'react';
import { useModule } from '../../../contexts/ModuleContext';
import api from '../../../services/api';

interface PracticeSelecionarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}

interface SelecaoData {
    palavras_corretas: string[];
    video_url: string;
    texto_base: string;
}

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v');
        }
    } catch (e) {
        return null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export default function PracticeSelecionarContent({ data }: PracticeSelecionarContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted } = useModule();
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'correct' | 'incorrect' | 'loading'>('idle');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const selecaoData = data.dadosAtividade as SelecaoData;
    const lyrics = selecaoData.texto_base || '';
    const words = lyrics.split(/(\s+|\/)/).filter(w => w.trim() !== '');
    const embedUrl = getYouTubeEmbedUrl(selecaoData.video_url || '');

    const handleWordClick = (word: string, index: number) => {
        if (verificationStatus === 'correct') return;
        const wordIdentifier = `${word}-${index}`;
        if (selectedWords.includes(wordIdentifier)) {
            setSelectedWords(selectedWords.filter(w => w !== wordIdentifier));
        } else {
            setSelectedWords([...selectedWords, wordIdentifier]);
        }
    };

    const handleNext = () => {
        if (!activeItem) return;
        const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
        const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;
        if (hasNextItem) {
            setActiveItem(allItems[currentItemIndex + 1]);
        }
    };

    const handleVerify = () => {
        if (selectedWords.length === 0 || !activeItem) return;

        const userAnswers = selectedWords.map(w => w.split('-')[0]).sort();
        const correctAnswers = [...(selecaoData.palavras_corretas || [])].sort();
        const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);

        const respostaPayload = {
            atividade: { id: data.id },
            resposta: { "palavras_selecionadas": userAnswers },
            estaCorreta: isCorrect
        };
        api.post('/api/practice-respostas', respostaPayload).catch(error => {
            console.error("Failed to save practice attempt:", error);
        });

        setVerificationStatus('loading');
        setTimeout(() => {
            if (isCorrect) {
                setVerificationStatus('correct');
                setFeedbackMessage('Correto!');
                markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);
                setTimeout(() => {
                    handleNext();
                }, 2000);
            } else {
                setVerificationStatus('incorrect');
                setFeedbackMessage('Incorreto, tente novamente.');
            }
        }, 500);
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4">Etapa: Prática - Seleção</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                {data.instrucao}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, mb: 3 }}>
            <Box sx={{ flex: 1, position: 'relative' }}>
              {embedUrl && (
                <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: '14px', overflow: 'hidden', border: '1px solid #282828', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ position: 'absolute', top: 0, left: 0 }}></iframe>
                </Box>
              )}
            </Box>

            <Paper sx={{ flex: 2, bgcolor: '#1a1a1a', p: 3, borderRadius: 3, maxHeight: '500px', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <MusicNoteIcon sx={{ color: '#e0e0e0' }} />
                  <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Letra</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  {words.length > 0 ? (
                      words.map((word, index) => (
                          word === '/' ? <Typography key={index} sx={{ color: '#e0e0e0', mx: 1 }}>/</Typography> :
                          <Chip
                              key={`${word}-${index}`}
                              label={word}
                              onClick={() => handleWordClick(word, index)}
                              disabled={verificationStatus === 'correct'}
                              sx={{
                                  backgroundColor: selectedWords.includes(`${word}-${index}`) ? '#007aff' : '#282828',
                                  color: 'white',
                                  fontSize: '18px',
                                  p: '16px 8px',
                                  height: 'auto',
                                  borderRadius: '10px',
                                  '& .MuiChip-label': { p: '0' }
                              }}
                          />
                      ))
                  ) : (
                    <Typography sx={{ color: '#b3b3b3' }}>Nenhuma letra disponível.</Typography>
                  )}
              </Box>
              <Box sx={{ borderTop: 1, borderColor: '#282828', mt: 2, pt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      Palavras selecionadas: <span style={{ color: '#007aff' }}>{selectedWords.length}</span>
                  </Typography>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, pt: 2, minHeight: '48px' }}>
            {verificationStatus !== 'idle' && verificationStatus !== 'loading' && (
                <Typography sx={{ color: verificationStatus === 'correct' ? 'lightgreen' : 'red' }}>
                    {feedbackMessage}
                </Typography>
            )}
            {verificationStatus === 'loading' && <CircularProgress size={24} />}
            <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>
              Pular Pergunta
            </Button>
            <Button 
                variant="contained" 
                sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}
                onClick={handleVerify}
                disabled={selectedWords.length === 0 || verificationStatus === 'correct' || verificationStatus === 'loading'}
            >
              Verificar Resposta
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}