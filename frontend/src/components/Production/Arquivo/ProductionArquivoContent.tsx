
import { Box, Typography, Button, TextareaAutosize, styled, Paper, LinearProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState } from 'react'; // Assuming local state for comments/file handling

const Dropzone = styled('div')(({ theme }) => ({
    border: `2px dashed ${theme.palette.grey[700]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#1a1a1a',
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
}));

interface ProductionArquivoContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
}

// Assuming data structure for ARQUIVO type in dadosDesafio
interface ArquivoData {
    // The video URL will come from midiaDesafioUrl
    // The instruction/title will come from instrucaoDesafio
    acceptedFormats?: string[]; // e.g., ["PDF", "DOCX", "PNG", "JPG"]
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

export default function ProductionArquivoContent({ data }: ProductionArquivoContentProps) {
    const arquivoData = data.dadosDesafio as ArquivoData;
    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');
    const [comment, setComment] = useState(''); // State for the optional comment

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

          <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Desafio de Produção - Arquivo</Typography>

          {embedUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Box sx={{
                position: 'relative',
                paddingTop: '35%', // Adjusting aspect ratio for a different video size
                borderRadius: '14px',
                overflow: 'hidden',
                width: '65%',
                maxWidth: 700,
                border: '1px solid #282828',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
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

          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 1 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio</Typography> {/* Could be dynamic from instrucaoDesafio if it needs a separate title */}
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              {data.instrucaoDesafio}
            </Typography>
          </Paper>

          <Box sx={{ mb: 1 }}>
            <Dropzone>
              <UploadFileIcon sx={{ fontSize: 64, color: '#b3b3b3' }} />
              <Typography variant="h6" sx={{ color: '#e0e0e0', mt: 2 }}>
                Arraste e solte seu arquivo aqui
              </Typography>
              <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                ou <Button component="span" sx={{ color: '#007aff', textTransform: 'none' }}>clique para procurar</Button>
              </Typography>
              {arquivoData.acceptedFormats && arquivoData.acceptedFormats.length > 0 && (
                <Typography variant="caption" sx={{ color: '#b3b3b3', mt: 2 }}>
                  Formatos aceitos: {arquivoData.acceptedFormats.join(', ').toUpperCase()}
                </Typography>
              )}
            </Dropzone>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#e0e0e0', mb: 1 }}>Adicionar um comentário (opcional)</Typography>
            <TextareaAutosize
              minRows={4}
              placeholder="Explique brevemente seu arquivo aqui..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1a1a1a',
                color: '#e0e0e0',
                border: '2px solid #282828',
                borderRadius: '14px',
                padding: '16px',
                fontFamily: 'inherit',
                fontSize: '16px'
              }}
            />
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
