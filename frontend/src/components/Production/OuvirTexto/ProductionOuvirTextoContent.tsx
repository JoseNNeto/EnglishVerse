
import { Box, Typography, Paper, LinearProgress, Button, TextareaAutosize } from '@mui/material';
import { useState } from 'react';

interface ProductionOuvirTextoContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
}

// Assuming data structure for OUVIR_TEXTO type in dadosDesafio
interface OuvirTextoData {
    title: string;
    subtitle: string;
    textParts: (string | { label: string; placeholder: string; })[];
}

export default function ProductionOuvirTextoContent({ data }: ProductionOuvirTextoContentProps) {
    const ouvirTextoData = data.dadosDesafio as OuvirTextoData;
    
    // Initialize state for the text areas based on the number of blanks
    const numberOfBlanks = ouvirTextoData.textParts?.filter(p => typeof p === 'object').length || 0;
    const [answers, setAnswers] = useState<string[]>(Array(numberOfBlanks).fill(''));

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <Box sx={{ width: '90%' }}>
                <Box sx={{ color: '#e0e0e0' }}>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: 0%</Typography> {/* Placeholder */}
                        </Box>
                        <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 4 }} /> {/* Placeholder */}
                    </Box>

                    <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Desafio de Produção - Ouvir e Escrever</Typography>
                    
                    {data.midiaDesafioUrl && (
                        <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6">{ouvirTextoData.title || 'Áudio do Desafio'}</Typography>
                            {ouvirTextoData.subtitle && <Typography variant="body2" sx={{color: '#b3b3b3'}}>{ouvirTextoData.subtitle}</Typography>}
                            <audio controls src={data.midiaDesafioUrl} style={{width: '100%'}}>
                                Seu navegador não suporta o elemento de áudio.
                            </audio>
                        </Paper>
                    )}

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            {data.instrucaoDesafio}
                        </Typography>
                    </Paper>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3 }}>
                        {ouvirTextoData.textParts && ouvirTextoData.textParts.map((part, index) => {
                            if (typeof part === 'string') {
                                return (
                                    <Typography key={index} variant="body1" sx={{mb: 2}}>
                                        {part}
                                    </Typography>
                                );
                            }
                            // It's a blank to fill
                            const blankIndex = ouvirTextoData.textParts.slice(0, index).filter(p => typeof p === 'object').length;
                            return (
                                <Box key={index} sx={{mb: 2}}>
                                    <Typography variant="caption" sx={{color: '#b3b3b3', mb: 1}}>{part.label}</Typography>
                                    <TextareaAutosize 
                                        minRows={3} 
                                        placeholder={part.placeholder} 
                                        value={answers[blankIndex]}
                                        onChange={(e) => handleAnswerChange(blankIndex, e.target.value)}
                                        style={{ width: '100%', backgroundColor: '#121212', color: '#e0e0e0', border: '2px solid #282828', borderRadius: '14px', padding: '16px', fontFamily: 'inherit', fontSize: '16px' }}
                                    />
                                </Box>
                            );
                        })}
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" size="large" sx={{ textTransform: 'none', borderRadius: 3, opacity: 0.5 }}>
                        Enviar Desafio
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
