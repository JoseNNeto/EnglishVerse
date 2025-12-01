import { Box, Typography, LinearProgress, Button, TextField } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useState } from 'react';

interface PracticeCompletarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}

// Updated interface to match seeder data
interface CompletarData {
    video_url: string;
    frase_com_lacuna: string;
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
    const completarData = data.dadosAtividade as CompletarData;
    const embedUrl = getYouTubeEmbedUrl(completarData.video_url);

    const [answer, setAnswer] = useState('');

    // Parse the sentence with the blank
    const sentenceWithBlank = completarData.frase_com_lacuna || '___';
    const sentenceParts = sentenceWithBlank.split('___');
    const part1 = sentenceParts[0];
    const part2 = sentenceParts.length > 1 ? sentenceParts[1] : '';


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h6">Etapa: Prática - Completar</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: 0%</Typography> {/* Placeholder */}
          </Box>
          <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 4, mb: 3 }} /> {/* Placeholder */}

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
            {embedUrl ? (
                <Box sx={{
                    position: 'relative',
                    paddingTop: '28.125%', // 16:9 Aspect Ratio, halved for 50% width
                    borderRadius: '14px',
                    overflow: 'hidden',
                    mb: 3,
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
            ) : (
                <Box sx={{ position: 'relative', paddingTop: '28.125%', borderRadius: '14px', overflow: 'hidden', mb: 3, width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#282828', color: '#b3b3b3' }}>
                    <Typography>Vídeo não disponível</Typography>
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
                    sx={{
                    mx: 1,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                        borderColor: '#007aff',
                        borderRadius: '10px',
                        },
                        '&:hover fieldset': {
                        borderColor: '#007aff',
                        },
                        '&.Mui-focused fieldset': {
                        borderColor: '#007aff',
                        },
                        backgroundColor: '#282828',
                        color: '#e0e0e0',
                        height: '44px',
                    },
                    '& .MuiInputBase-input': {
                        textAlign: 'center',
                        p: '8px 16px',
                    },
                    width: '150px' // Default width
                    }}
                />
                <Typography variant="h6" sx={{ color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
                    {part2}
                </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
            <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>
              Pular Pergunta
            </Button>
            <Button variant="contained" sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
              Verificar Resposta
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
