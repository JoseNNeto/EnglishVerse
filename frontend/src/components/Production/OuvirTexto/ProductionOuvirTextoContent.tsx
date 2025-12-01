import { Box, Typography, Paper, LinearProgress, Button, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModule } from '../../../contexts/ModuleContext';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

interface ProductionOuvirTextoContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
    isLast?: boolean;
}

interface OuvirTextoData {
    title: string;
    subtitle: string;
    textParts: (string | { label: string; placeholder: string; })[];
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
        console.error("Invalid URL for YouTube embed:", e);
        return null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export default function ProductionOuvirTextoContent({ data, isLast }: ProductionOuvirTextoContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted, modulo } = useModule();
    const { user } = useAuth();
    const navigate = useNavigate();
    const ouvirTextoData = data.dadosDesafio as OuvirTextoData;
    
    const numberOfBlanks = ouvirTextoData.textParts?.filter(p => typeof p === 'object').length || 0;
    const [answers, setAnswers] = useState<string[]>(Array(numberOfBlanks).fill(''));

    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
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

    const handleSubmit = () => {
        if (answers.some(ans => ans.trim() === '') || !activeItem) return;
        markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);
        handleNext();
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ color: '#e0e0e0' }}>

                    <Typography variant="h4">Etapa: Desafio de Produção - Ouvir e Escrever</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                        <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            {data.instrucaoDesafio}
                        </Typography>
                    </Box>
                    
                    {embedUrl && (
                        <Box sx={{ position: 'relative', paddingTop: '35%', borderRadius: '14px', overflow: 'hidden', mb: 3, border: '1px solid #282828', width: '40%', margin: '0 auto' }}>
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={embedUrl} 
                                title="YouTube video player" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin" 
                                allowFullScreen 
                                style={{ position: 'absolute', top: 0, left: 0, border: 0 }}
                            ></iframe>
                        </Box>
                    )}

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3 }}>
                        {ouvirTextoData.textParts && ouvirTextoData.textParts.map((part, index) => {
                            if (typeof part === 'string') {
                                return (
                                    <Typography key={index} variant="body1" sx={{mb: 2}}>
                                        {part}
                                    </Typography>
                                );
                            }
                            const blankIndex = ouvirTextoData.textParts.slice(0, index).filter(p => typeof p === 'object').length;
                            return (
                                <Box key={index} sx={{mb: 2}}>
                                    <Typography variant="body1" sx={{color: '#e0e0e0', mb: 1}}>{part.label}</Typography>
                                    <TextareaAutosize 
                                        minRows={3} 
                                        placeholder={part.placeholder} 
                                        value={answers[blankIndex]}
                                        onChange={(e) => handleAnswerChange(blankIndex, e.target.value)}
                                        style={{ 
                                            width: '100%', 
                                            backgroundColor: '#121212', 
                                            color: '#e0e0e0', 
                                            border: '2px solid #282828', 
                                            borderRadius: '14px', 
                                            padding: '12px 16px', 
                                            fontFamily: 'inherit', 
                                            fontSize: '16px' 
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            sx={{ textTransform: 'none', borderRadius: 3 }}
                            onClick={handleSubmit}
                            disabled={answers.some(ans => ans.trim() === '')}
                        >
                            {isLast ? 'Enviar Desafio e concluir módulo' : 'Enviar Desafio'}
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}