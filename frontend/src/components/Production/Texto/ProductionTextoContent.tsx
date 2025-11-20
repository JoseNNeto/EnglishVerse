
import { Box, Typography, Button, TextareaAutosize, Paper, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ProductionTextoContent() {
    const navigate = useNavigate();

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        navigate(newValue);
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>

        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Atividade 2 de 2</Typography>
                <Typography sx={{ color: '#b3b3b3' }}>100%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

          <Typography variant="h4" sx={{ mb: 3 }}>Etapa 3: Desafio de Produção</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{
              position: 'relative',
              paddingTop: '30%', // Adjusting aspect ratio for a different video size
              borderRadius: '14px',
              overflow: 'hidden',
              width: '80%',
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

          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio: Análise Crítica</Typography>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              Você assistiu à cena final de 'O Poderoso Chefão'. Considerando o diálogo e a cinematografia, responda em um parágrafo longo (pelo menos 100 palavras): Você acha que Michael Corleone se tornou um vilão? Justifique sua resposta em inglês.
            </Typography>
          </Paper>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>Sua Resposta:</Typography>
            <TextareaAutosize
              minRows={10}
              placeholder="Comece a escrever sua análise aqui..."
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>Mínimo de 100 palavras</Typography>
                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>0/100 palavras</Typography>
            </Box>
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
