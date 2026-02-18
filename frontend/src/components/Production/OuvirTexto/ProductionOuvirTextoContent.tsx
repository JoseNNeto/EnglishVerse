
import { Box, Typography, Paper, Button, TextareaAutosize } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactMarkdown from 'react-markdown';

interface ProductionOuvirTextoContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
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
        videoId = urlObj.searchParams.get('v') || urlObj.pathname.slice(1).split('?')[0];
    } catch (e) { return null; }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export default function ProductionOuvirTextoContent({ data }: ProductionOuvirTextoContentProps) {
    const { markItemAsCompleted, handleNextItem } = useModule();
    const ouvirTextoData = data.dadosDesafio as OuvirTextoData;
    
    const numberOfBlanks = ouvirTextoData.textParts?.filter(p => typeof p === 'object').length || 0;
    const [answers, setAnswers] = useState<string[]>(Array(numberOfBlanks).fill(''));
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct'>('unchecked');

    useEffect(() => {
        setAnswers(Array(numberOfBlanks).fill(''));
        setCheckStatus('unchecked');
    }, [data.id, numberOfBlanks]);


    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const allFieldsFilled = answers.every(answer => answer.trim() !== '');

    const handleCheckAnswer = async () => {
        if (!allFieldsFilled) return;
        setCheckStatus('correct');
        await markItemAsCompleted(data.id, ItemType.PRODUCTION);
    };

    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ color: '#e0e0e0' }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Desafio de Produção - Ouvir e Escrever</Typography>
                    
                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            <ReactMarkdown>{data.instrucaoDesafio}</ReactMarkdown>
                        </Typography>
                    </Paper>

                    {embedUrl && (
                         <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Box sx={{ position: 'relative', paddingTop: '40%', borderRadius: '14px', overflow: 'hidden', width: '100%', maxWidth: '720px'}}>
                                <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: 'absolute', top: 0, left: 0 }}></iframe>
                            </Box>
                        </Box>
                    )}

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3 }}>
                        {ouvirTextoData.textParts && ouvirTextoData.textParts.map((part, index) => {
                            if (typeof part === 'string') {
                                return <Typography key={index} variant="body1" sx={{mb: 2}}>{part}</Typography>;
                            }
                            const blankIndex = ouvirTextoData.textParts.slice(0, index).filter(p => typeof p === 'object').length;
                            return (
                                <Box key={index} sx={{mb: 2}}>
                                    <Typography variant="caption" sx={{color: '#b3b3b3', mb: 1}}>{part.label}</Typography>
                                    <TextareaAutosize 
                                        minRows={3} 
                                        placeholder={part.placeholder} 
                                        value={answers[blankIndex]}
                                        onChange={(e) => handleAnswerChange(blankIndex, e.target.value)}
                                        disabled={checkStatus === 'correct'}
                                        style={{ width: '100%', backgroundColor: '#121212', color: '#e0e0e0', border: '2px solid #282828', borderRadius: '14px', padding: '16px', fontFamily: 'inherit', fontSize: '16px' }}
                                    />
                                </Box>
                            );
                        })}
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                        {checkStatus === 'unchecked' && <Button variant="contained" size="large" onClick={handleCheckAnswer} disabled={!allFieldsFilled} sx={{ textTransform: 'none', borderRadius: 3 }}>Enviar Desafio</Button>}
                        {checkStatus === 'correct' && <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none' }}>Próximo</Button>}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
