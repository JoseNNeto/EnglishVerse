import { Box, Typography, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactMarkdown from 'react-markdown';

interface PracticeMarcarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

interface MarcarData {
    pergunta: string;
    opcoes: string[];
    resposta_correta: string;
}

export default function PracticeMarcarContent({ data }: PracticeMarcarContentProps) {
    const { markItemAsCompleted, handleNextItem } = useModule();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');

    useEffect(() => {
        setSelectedOption(null);
        setCheckStatus('unchecked');
    }, [data.id]);

    const marcarData = data.dadosAtividade as MarcarData;

    const handleCheckAnswer = async () => {
        if (!selectedOption) return;
        if (selectedOption === marcarData.resposta_correta) {
            setCheckStatus('correct');
            await markItemAsCompleted(data.id, ItemType.PRACTICE);
        } else {
            setCheckStatus('incorrect');
        }
    };

    const handleTryAgain = () => {
        setCheckStatus('unchecked');
        setSelectedOption(null);
    };
    
    const getButtonSx = (option: string) => {
        const isSelected = selectedOption === option;
        const isCorrect = option === marcarData.resposta_correta;

        if (checkStatus === 'correct' && isSelected) {
            return { borderColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.2)' };
        }
        if (checkStatus === 'incorrect' && isSelected) {
            return { borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.2)' };
        }
        if (checkStatus !== 'unchecked' && isCorrect) {
            return { borderColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.2)' };
        }
        if (isSelected) {
            return { borderColor: '#007aff', backgroundColor: 'rgba(0,122,255,0.2)' };
        }
        return { borderColor: '#282828', backgroundColor: 'rgba(40,40,40,0.4)' };
    };

  return (
    <Box sx={{ color: '#e0e0e0' }}>
      <Typography variant="h4">Etapa: Practice - Multiple Choice</Typography>

      <Box sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, my: 3, textAlign: 'center' }}>
        <Typography variant="h5"><ReactMarkdown>{marcarData.pergunta || data.instrucao}</ReactMarkdown></Typography>
      </Box>

      <Grid container spacing={2} paddingX={2}>
        {marcarData.opcoes && marcarData.opcoes.map((option, index) => (
            <Grid size={{ xs:6 }} key={index}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => checkStatus === 'unchecked' && setSelectedOption(option)}
                    sx={{
                        p: 4,
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: 3,
                        ...getButtonSx(option),
                        '&:hover': {
                            borderColor: '#b3b3b3',
                            backgroundColor: 'rgba(40,40,40,0.6)',
                        }
                    }}
                >
                    <Typography variant="h6">{option}</Typography>
                </Button>
            </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 4 }}>
        {checkStatus === 'unchecked' && (
            <>
                {/* <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>
                    Pular Pergunta
                </Button> */}
                <Button variant="contained" onClick={handleCheckAnswer} disabled={!selectedOption} sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
                    Verificar Resposta
                </Button>
            </>
        )}
        {checkStatus === 'correct' && (
            <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
                Próximo
            </Button>
        )}
        {checkStatus === 'incorrect' && (
            <Button variant="contained" onClick={handleTryAgain} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
                Tentar Novamente
            </Button>
        )}
      </Box>
    </Box>
  );
}
