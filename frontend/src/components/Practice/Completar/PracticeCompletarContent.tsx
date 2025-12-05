import { Box, Typography, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface PracticeCompletarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

interface CompletarData {
    video_url?: string;
    imagem_url?: string;
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
    const { markItemAsCompleted, handleNextItem } = useModule();
    const [answer, setAnswer] = useState('');
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');

    useEffect(() => {
        setAnswer('');
        setCheckStatus('unchecked');
    }, [data.id]);

    const completarData = data.dadosAtividade as CompletarData;
    const embedUrl = getYouTubeEmbedUrl(completarData.video_url || '');
    const imageUrl = completarData.imagem_url;

    const sentenceWithBlank = completarData.frase_com_lacuna || '___';
    const sentenceParts = sentenceWithBlank.split('___');
    const part1 = sentenceParts[0];
    const part2 = sentenceParts.length > 1 ? sentenceParts[1] : '';

    const handleCheckAnswer = async () => {
        if (answer.trim().toLowerCase() === completarData.resposta_correta.toLowerCase()) {
            setCheckStatus('correct');
            await markItemAsCompleted(data.id, ItemType.PRACTICE);
        } else {
            setCheckStatus('incorrect');
        }
    };

    const handleTryAgain = () => {
        setCheckStatus('unchecked');
        setAnswer('');
    };

    const getTextFieldSx = () => {
        if (checkStatus === 'correct') {
            return { borderColor: 'green !important' };
        }
        if (checkStatus === 'incorrect') {
            return { borderColor: 'red !important' };
        }
        return { borderColor: '#007aff' };
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4">Etapa: Prática - Completar</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              {data.instrucao}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            {embedUrl ? (
                <Box sx={{
                    position: 'relative',
                    paddingTop: '28.125%',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    width: '50%'
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
            ) : imageUrl && (
                <Box
                    component="img"
                    src={imageUrl}
                    alt="Contexto da atividade"
                    sx={{
                        maxWidth: '50%',
                        height: 'auto',
                        borderRadius: '14px',
                    }}
                />
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
                    disabled={checkStatus !== 'unchecked'}
                    sx={{
                    mx: 1,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': getTextFieldSx(),
                        borderRadius: '10px',
                        backgroundColor: '#282828',
                        color: '#e0e0e0',
                        height: '44px',
                    },
                    '& .MuiInputBase-input': {
                        textAlign: 'center',
                        p: '8px 16px',
                    },
                    width: '150px'
                    }}
                />
                <Typography variant="h6" sx={{ color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
                    {part2}
                </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
            {checkStatus === 'unchecked' && (
                <>
                    <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>
                        Pular Pergunta
                    </Button>
                    <Button variant="contained" onClick={handleCheckAnswer} sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
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
      </Box>
    </Box>
  );
}
