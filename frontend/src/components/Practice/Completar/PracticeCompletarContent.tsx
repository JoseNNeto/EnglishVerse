
import { Box, Typography, LinearProgress, Button, TextField, CircularProgress } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useState } from 'react';
import { useModule } from '../../../contexts/ModuleContext';
import api from '../../../services/api';

interface PracticeCompletarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}
interface CompletarData {
    video_url: string;
    frase_com_lacuna: string;
    resposta_correta: string;
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

export default function PracticeCompletarContent({ data }: PracticeCompletarContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted } = useModule();
    const completarData = data.dadosAtividade as CompletarData;
    const embedUrl = getYouTubeEmbedUrl(completarData.video_url);

    const [answer, setAnswer] = useState('');
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'correct' | 'incorrect' | 'loading'>('idle');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const sentenceWithBlank = completarData.frase_com_lacuna || '___';
    const sentenceParts = sentenceWithBlank.split('___');
    const part1 = sentenceParts[0];
    const part2 = sentenceParts.length > 1 ? sentenceParts[1] : '';

    const handleNext = () => {
        if (!activeItem) return;
        const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
        const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;
        if (hasNextItem) {
            setActiveItem(allItems[currentItemIndex + 1]);
        }
    };

    const handleVerify = () => {
        if (!answer || !activeItem) return;
        const isCorrect = answer.trim().toLowerCase() === completarData.resposta_correta.trim().toLowerCase();

        const respostaPayload = {
            atividade: { id: data.id },
            resposta: { "texto": answer },
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
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4">Etapa: Prática - Completar</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              {data.instrucao}
            </Typography>
            <Button
              startIcon={<LightbulbOutlinedIcon />}
              sx={{ color: '#007aff', textTransform: 'none', bgcolor: '#1a1a1a', borderRadius: 3, p: '8px 16px' }}
            >
              Dica
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {embedUrl && (
                <Box sx={{
                    position: 'relative',
                    paddingTop: '28.125%', 
                    borderRadius: '14px',
                    overflow: 'hidden',
                    mb: 3,
                    width: '50%'
                }}>
                    <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ position: 'absolute', top: 0, left: 0 }}></iframe>
                </Box>
            )}
          </Box>

          <Box sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
                    {part1}
                </Typography>
                <TextField
                    variant="outlined"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={verificationStatus === 'correct' || verificationStatus === 'loading'}
                    sx={{
                    mx: 1,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#007aff', borderRadius: '10px' },
                        '&:hover fieldset': { borderColor: '#007aff' },
                        '&.Mui-focused fieldset': { borderColor: '#007aff' },
                        backgroundColor: '#282828',
                        color: '#e0e0e0',
                        height: '44px',
                    },
                    '& .MuiInputBase-input': { textAlign: 'center', p: '8px 16px' },
                    width: '150px'
                    }}
                />
                <Typography variant="h6" sx={{ color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
                    {part2}
                </Typography>
            </Box>
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
                disabled={!answer || verificationStatus === 'correct' || verificationStatus === 'loading'}
            >
              Verificar Resposta
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
