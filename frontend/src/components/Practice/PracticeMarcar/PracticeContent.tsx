
import { Box, Typography, LinearProgress, Button, Grid, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useModule } from '../../../contexts/ModuleContext';
import api from '../../../services/api';

interface PracticeMarcarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}

interface MarcarData {
    pergunta: string;
    opcoes: string[];
    video_url?: string;
    imageUrl?: string;
    resposta_correta?: string;
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

const MediaDisplay = ({ data }: { data: MarcarData }) => {
    const embedUrl = getYouTubeEmbedUrl(data.video_url || '');
    if (embedUrl) {
        return (
            <Box sx={{ position: 'relative', paddingTop: '28.125%', borderRadius: '14px', overflow: 'hidden', mb: 3, border: '1px solid #282828', width: '50%', margin: '0 auto' }}>
                <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ position: 'absolute', top: 0, left: 0 }}></iframe>
            </Box>
        );
    }
    if (data.imageUrl) {
        return (
            <Box sx={{ borderRadius: '14px', overflow: 'hidden', mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <Box component="img" src={data.imageUrl} alt="Cena da atividade" sx={{ width: '100%', height: 'auto', maxWidth: 700, display: 'block' }} />
            </Box>
        );
    }
    return null;
}

export default function PracticeMarcarContent({ data }: PracticeMarcarContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted } = useModule();
    const marcarData = data.dadosAtividade as MarcarData;

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'correct' | 'incorrect' | 'loading'>('idle');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleNext = () => {
        if (!activeItem) return;
        const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
        const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;

        if (hasNextItem) {
            setActiveItem(allItems[currentItemIndex + 1]);
        }
    };

    const handleVerify = () => {
        if (!selectedOption || !activeItem) return;
        const isCorrect = selectedOption === marcarData.resposta_correta;

        const respostaPayload = {
            atividade: { id: data.id },
            resposta: { "selecionada": selectedOption },
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
                <Typography variant="h4">Etapa: Prática - Múltipla Escolha</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="body1" sx={{ color: '#b3b3b3' }}>{data.instrucao}</Typography>
                </Box>

                <MediaDisplay data={marcarData} />

                <Box sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, textAlign: 'center' }}>
                    <Typography variant="h6">{marcarData.pergunta || data.instrucao}</Typography>
                </Box>

                <Grid container spacing={2} paddingX={2}>
                    {marcarData.opcoes && marcarData.opcoes.map((option, index) => (
                        <Grid size={{ xs: 6 }} key={index}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => verificationStatus !== 'correct' && setSelectedOption(option)}
                                disabled={verificationStatus === 'correct'}
                                sx={{
                                    p: 4,
                                    borderColor: selectedOption === option ? '#007aff' : '#282828',
                                    backgroundColor: selectedOption === option ? 'rgba(0,122,255,0.2)' : 'rgba(40,40,40,0.4)',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: 3,
                                    '&:hover': { borderColor: selectedOption === option ? '#007aff' : '#b3b3b3', backgroundColor: selectedOption === option ? 'rgba(0,122,255,0.3)' : 'rgba(40,40,40,0.6)'}
                                }}
                            >
                                <Typography variant="h6">{option}</Typography>
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, pt: 2, minHeight: '48px' }}>
                    {verificationStatus !== 'idle' && verificationStatus !== 'loading' && (
                        <Typography sx={{ color: verificationStatus === 'correct' ? 'lightgreen' : 'red' }}>{feedbackMessage}</Typography>
                    )}
                    {verificationStatus === 'loading' && <CircularProgress size={24} />}
                    <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>Pular Pergunta</Button>
                    <Button 
                        variant="contained" 
                        sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}
                        onClick={handleVerify}
                        disabled={!selectedOption || verificationStatus === 'correct' || verificationStatus === 'loading'}
                    >
                        Verificar Resposta
                    </Button>
                </Box>
            </Box>
        </Box>
    </Box>
  );
}
