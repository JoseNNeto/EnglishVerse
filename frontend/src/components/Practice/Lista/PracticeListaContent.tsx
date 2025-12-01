import { Box, Typography, LinearProgress, Button, Grid, TextField, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModule } from '../../../contexts/ModuleContext';
import api from '../../../services/api';

interface PracticeListaContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}

interface ListaPalavrasData {
    imageUrl?: string;
    video_url?: string;
    numberOfInputs: number;
    palavras_esperadas?: string[];
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

const MediaDisplay = ({ data }: { data: ListaPalavrasData }) => {
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

export default function PracticeListaContent({ data }: PracticeListaContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted, modulo, user } = useModule();
    const navigate = useNavigate();
    const listaPalavrasData = data.dadosAtividade as ListaPalavrasData;

    const [inputs, setInputs] = useState<string[]>(Array(listaPalavrasData.numberOfInputs || 3).fill(''));
    const [individualStatus, setIndividualStatus] = useState<('idle' | 'correct' | 'incorrect')[]>(Array(listaPalavrasData.numberOfInputs || 3).fill('idle'));
    const [checkStatus, setCheckStatus] = useState<'idle' | 'loading' | 'completed'>('idle');

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);

        if (individualStatus[index] === 'incorrect') {
            const newStatus = [...individualStatus];
            newStatus[index] = 'idle';
            setIndividualStatus(newStatus);
        }
    };

    const handleNext = () => {
        if (!activeItem) return;
        const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
        const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;
        if (hasNextItem) {
            setActiveItem(allItems[currentItemIndex + 1]);
        } else {
            if (user && modulo) {
                api.put(`/progresso/concluir?alunoId=${user.id}&moduloId=${modulo.id}`)
                    .then(() => {
                        console.log("Módulo concluído! Redirecionando...");
                        setTimeout(() => navigate('/'), 1500); 
                    })
                    .catch(console.error);
            }
        }
    };

    const handleVerify = () => {
        if (inputs.some(input => input.trim() === '') || !activeItem || checkStatus === 'loading') return;

        setCheckStatus('loading');

        const userAnswers = inputs.map(i => i.trim().toLowerCase());
        const correctAnswersSet = new Set((listaPalavrasData.palavras_esperadas || []).map((i: string) => i.trim().toLowerCase()));
        
        const seenAnswers = new Set<string>();
        const newStatus = userAnswers.map(answer => {
            if (correctAnswersSet.has(answer) && !seenAnswers.has(answer)) {
                seenAnswers.add(answer);
                return 'correct';
            } else {
                return 'incorrect';
            }
        });
        
        setIndividualStatus(newStatus);

        const allCorrect = newStatus.every(status => status === 'correct');

        const respostaPayload = {
            atividade: { id: data.id },
            resposta: { "lista_palavras": userAnswers },
            estaCorreta: allCorrect
        };

        api.post('/api/practice-respostas', respostaPayload).catch(error => {
            console.error("Failed to save practice attempt:", error);
        });

        setTimeout(() => {
            if (allCorrect) {
                setCheckStatus('completed');
                markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);
                setTimeout(() => {
                    handleNext();
                }, 1500);
            } else {
                setCheckStatus('idle');
            }
        }, 500);
    };

    const getBorderColor = (status: 'idle' | 'correct' | 'incorrect') => {
        switch (status) {
            case 'correct':
                return 'lightgreen';
            case 'incorrect':
                return 'red';
            case 'idle':
            default:
                return '#007aff';
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ color: '#e0e0e0' }}>
                    <Typography variant="h4">Etapa: Prática - Lista de Palavras</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                        <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            {data.instrucao}
                        </Typography>
                    </Box>

                    <MediaDisplay data={listaPalavrasData} />

                    <Box sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            {inputs.map((value, index) => (
                                <Grid size={{ xs:12 }} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#b3b3b3', width: '20px' }}>
                                            {index + 1}.
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            placeholder="Digite uma palavra..."
                                            fullWidth
                                            value={value}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            disabled={checkStatus === 'loading' || checkStatus === 'completed'}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { 
                                                        borderColor: getBorderColor(individualStatus[index]), 
                                                        borderRadius: '10px',
                                                        transition: 'border-color 0.3s'
                                                    },
                                                    '&:hover fieldset': { borderColor: getBorderColor(individualStatus[index]) },
                                                    '&.Mui-focused fieldset': { borderColor: getBorderColor(individualStatus[index]) },
                                                    backgroundColor: '#282828',
                                                    color: '#e0e0e0',
                                                    height: '44px',
                                                },
                                                '& .MuiInputBase-input': { p: '8px 16px' },
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, pt: 2, minHeight: '48px' }}>
                        {checkStatus === 'completed' && (
                            <Typography sx={{ color: 'lightgreen' }}>
                                Correto! Avançando...
                            </Typography>
                        )}
                        {checkStatus === 'loading' && <CircularProgress size={24} />}
                        <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px', visibility: checkStatus === 'completed' ? 'hidden' : 'visible' }}>
                            Pular Pergunta
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px', visibility: checkStatus === 'completed' ? 'hidden' : 'visible' }}
                            onClick={handleVerify}
                            disabled={inputs.some(input => input.trim() === '') || checkStatus === 'loading' || checkStatus === 'completed'}
                        >
                            Verificar Resposta
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
