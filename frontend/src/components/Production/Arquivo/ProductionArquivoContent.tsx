
import { Box, Typography, Button, TextareaAutosize, styled, Paper, LinearProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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

export default function ProductionArquivoContent() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>

        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Atividade 1 de 2</Typography>
                <Typography sx={{ color: '#b3b3b3' }}>50%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={50} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

          <Typography variant="h4" sx={{ mb: 3 }}>Etapa 3: Desafio de Produção</Typography>

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
                  src="https://www.youtube.com/embed/Vmb1tqYqyII"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0 }}
              ></iframe>
            </Box>
          </Box>

          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 1 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio: Criar um Roteiro</Typography>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              Incrível! Agora que você viu como o diálogo funciona em 'Friends', crie um pequeno roteiro de uma página (.pdf ou .docx) para uma cena de comédia entre dois amigos. Ou, se preferir, envie uma imagem (.png ou .jpg) de um meme que você criou sobre a série.
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
              <Typography variant="caption" sx={{ color: '#b3b3b3', mt: 2 }}>
                Formatos aceitos: PDF, DOCX, PNG, JPG
              </Typography>
            </Dropzone>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#e0e0e0', mb: 1 }}>Adicionar um comentário (opcional)</Typography>
            <TextareaAutosize
              minRows={4}
              placeholder="Explique brevemente seu arquivo aqui..."
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
              Enviar Desafio e Concluir Módulo!
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
