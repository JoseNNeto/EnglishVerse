
import { Box, Typography, Button, Paper, LinearProgress, TextField } from '@mui/material';
import { useState } from 'react';
interface ProductionOuvirCompletarContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
}

// Assuming data structure for OUVIR_COMPLETAR type in dadosDesafio
interface OuvirCompletarData {
    imageUrl: string;
    blankPositions: { top: number; left: number; width: number; }[];
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

export default function ProductionOuvirCompletarContent({ data }: ProductionOuvirCompletarContentProps) {
    const ouvirCompletarData = data.dadosDesafio as OuvirCompletarData;
    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');
    const [answers, setAnswers] = useState<string[]>(Array(ouvirCompletarData.blankPositions?.length || 0).fill(''));

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

          <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Desafio de Produção - Ouvir e Completar</Typography>

          {data.midiaDesafioUrl && (
            <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Áudio/Vídeo do Desafio</Typography>
              <Typography variant="body2" sx={{color: '#b3b3b3'}}>Ouça com atenção para completar as falas.</Typography>
              
              {embedUrl ? ( // If it's a YouTube video
                 <Box sx={{
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9 Aspect Ratio
                    borderRadius: '14px',
                    overflow: 'hidden',
                    mb: 3,
                    width: '100%'
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
              ) : ( // Assume it's an audio file if not YouTube
                <audio controls src={data.midiaDesafioUrl} style={{width: '100%'}}>
                    Seu navegador não suporta o elemento de áudio.
                </audio>
              )}
            </Paper>
          )}

          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio</Typography>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              {data.instrucaoDesafio}
            </Typography>
          </Paper>

          {ouvirCompletarData.imageUrl && (
            <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, position: 'relative' }}>
              <Box
                  component="img"
                  src={ouvirCompletarData.imageUrl}
                  alt="Comic strip"
                  sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '10px',
                      display: 'block',
                  }}
              />
              {ouvirCompletarData.blankPositions && ouvirCompletarData.blankPositions.map((pos, index) => (
                <TextField
                    key={index}
                    placeholder={`Fale ${index + 1}...`}
                    variant="outlined"
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    sx={{
                        position: 'absolute', 
                        top: pos.top, 
                        left: pos.left, 
                        width: pos.width, 
                        bgcolor: 'rgba(0,0,0,0.3)', 
                        '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#b3b3b3'}, borderRadius: '10px'},
                        transform: 'translate(-50%, -50%)' // Center based on top/left
                    }}
                />
              ))}
            </Paper>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Balões preenchidos: {answers.filter((ans: string) => ans && ans.length > 0).length} / {answers.length}</Typography>
            <Typography variant="body2" sx={{ color: '#007aff' }}>0%</Typography> {/* Placeholder */}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" size="large" sx={{ textTransform: 'none', borderRadius: 3, opacity: 0.5 }}>
              Enviar Desafio
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
