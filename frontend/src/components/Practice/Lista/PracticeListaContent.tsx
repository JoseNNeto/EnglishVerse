import { Box, Typography, Button, Grid, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface PracticeListaContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

interface ListaPalavrasData {
    video_url: string;
    numberOfInputs: number;
    respostas_possiveis: string[];
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

export default function PracticeListaContent({ data }: PracticeListaContentProps) {
    const { markItemAsCompleted, handleNextItem } = useModule();
    const listaPalavrasData = data.dadosAtividade as ListaPalavrasData;

    const [inputs, setInputs] = useState<string[]>(Array(listaPalavrasData.numberOfInputs || 0).fill(''));
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');
    const [inputStatus, setInputStatus] = useState<('correct' | 'incorrect' | 'default')[]>(Array(listaPalavrasData.numberOfInputs || 0).fill('default'));

    useEffect(() => {
        const numInputs = listaPalavrasData.numberOfInputs || 0;
        setInputs(Array(numInputs).fill(''));
        setCheckStatus('unchecked');
        setInputStatus(Array(numInputs).fill('default'));
    }, [data.id, listaPalavrasData.numberOfInputs]);


    const handleInputChange = (index: number, value: string) => {
        if (checkStatus !== 'unchecked') return;
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    const handleCheckAnswer = async () => {
        const possibleAnswers = new Set((listaPalavrasData.respostas_possiveis || []).map(a => a.toLowerCase()));
        const userAnswers = inputs.map(i => i.trim().toLowerCase());
        const uniqueUserAnswers = new Set(userAnswers.filter(i => i !== ''));

        const newStatus = userAnswers.map(answer => {
            if (answer === '') return 'default';
            return possibleAnswers.has(answer) ? 'correct' : 'incorrect';
        });
        setInputStatus(newStatus);

        const isCorrect = uniqueUserAnswers.size === listaPalavrasData.numberOfInputs &&
                           [...uniqueUserAnswers].every(answer => possibleAnswers.has(answer));

        if (isCorrect) {
            setCheckStatus('correct');
            await markItemAsCompleted(data.id, ItemType.PRACTICE);
        } else {
            setCheckStatus('incorrect');
        }
    };
    
    const handleTryAgain = () => {
        setCheckStatus('unchecked');
        setInputStatus(Array(listaPalavrasData.numberOfInputs || 0).fill('default'));
        setInputs(Array(listaPalavrasData.numberOfInputs || 0).fill(''));
    };

    const getTextFieldSx = (index: number) => {
        const status = inputStatus[index];
        if (status === 'correct') return { borderColor: 'green !important' };
        if (status === 'incorrect') return { borderColor: 'red !important' };
        return { borderColor: '#007aff' };
    };

    const embedUrl = getYouTubeEmbedUrl(listaPalavrasData.video_url);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4">Etapa: Prática - Lista de Palavras</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              {data.instrucao}
            </Typography>
          </Box>

          {embedUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{
                    position: 'relative',
                    paddingTop: '40%',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    width: '70%',
                }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    ></iframe>
                </Box>
            </Box>
          )}

          <Box sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              {inputs.map((value, index) => (
                <Grid size={{xs: 12}} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ color: '#b3b3b3', width: '20px' }}>
                      {index + 1}.
                    </Typography>
                    <TextField
                      variant="outlined"
                      placeholder="Digite um pronome..."
                      fullWidth
                      value={value}
                      disabled={checkStatus !== 'unchecked'}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': getTextFieldSx(index),
                          borderRadius: '10px',
                          backgroundColor: '#282828',
                          color: '#e0e0e0',
                          height: '52px',
                        },
                        '& .MuiInputBase-input': { p: '12px 16px' },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
            {checkStatus === 'unchecked' && (
                <>
                    {/* <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>Pular Pergunta</Button> */}
                    <Button variant="contained" onClick={handleCheckAnswer} sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>Verificar Resposta</Button>
                </>
            )}
            {checkStatus === 'correct' && (
                <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>Próximo</Button>
            )}
            {checkStatus === 'incorrect' && (
                <Button variant="contained" onClick={handleTryAgain} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>Tentar Novamente</Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
