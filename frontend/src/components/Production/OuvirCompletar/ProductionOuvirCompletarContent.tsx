
import { Box, Typography, Button, Paper, LinearProgress, TextField } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const imgImageWithFallback = "https://www.figma.com/api/mcp/asset/8e4a39d0-77aa-4b23-a46b-e4bf1dfad4d8";

export default function ProductionOuvirCompletarContent() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>

          <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Atividade 3 de 7</Typography>
                  <Typography sx={{ color: '#b3b3b3' }}>42%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={42} sx={{ height: 8, borderRadius: 4 }} />
          </Box>

          <Typography variant="h4" sx={{ mb: 3 }}>Etapa 3: Desafio de Produção</Typography>

          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">Comic Strip Audio Dialogue</Typography>
            <Typography variant="body2" sx={{color: '#b3b3b3'}}>Listen carefully to complete the speech bubbles</Typography>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button sx={{ borderRadius: '50%', minWidth: 48, minHeight: 48, bgcolor: '#007aff', '&:hover': { bgcolor: '#006edb' } }}>
                    <PlayArrowIcon sx={{ color: 'white' }} />
                </Button>
                <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4, bgcolor: '#282828' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#b3b3b3' }}>0:15</Typography>
                        <Typography variant="caption" sx={{ color: '#b3b3b3' }}>0:30</Typography>
                    </Box>
                </Box>
            </Box>
          </Paper>

          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio: Completar a Tirinha</Typography>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              Ouça o diálogo entre os personagens. Agora, preencha os balões de fala em branco na tirinha abaixo com o que você ouviu.
            </Typography>
          </Paper>

          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, position: 'relative' }}>
            <Box
                component="img"
                src={imgImageWithFallback}
                alt="Comic strip"
                sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '10px',
                    display: 'block',
                }}
            />
            <TextField
                placeholder="Digite a primeira fala aqui..."
                variant="outlined"
                sx={{ position: 'absolute', top: 45, left: 72, width: 225, bgcolor: 'rgba(0,0,0,0.3)', '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#b3b3b3'}, borderRadius: '10px'}}}
            />
             <TextField
                placeholder="Digite a segunda fala aqui..."
                variant="outlined"
                sx={{ position: 'absolute', top: 45, left: 360, width: 225, bgcolor: 'rgba(0,0,0,0.3)', '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#b3b3b3'}, borderRadius: '10px'}}}
            />
             <TextField
                placeholder="Digite a terceira fala aqui..."
                variant="outlined"
                sx={{ position: 'absolute', top: 45, left: 603, width: 225, bgcolor: 'rgba(0,0,0,0.3)', '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#b3b3b3'}, borderRadius: '10px'}}}
            />
          </Paper>
          
          <Paper sx={{ bgcolor: '#282828', p: 2, borderRadius: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
              <span role="img" aria-label="light-bulb">💡</span> <strong>Dica:</strong> Ouça o áudio com atenção e preencha os balões de fala na ordem em que aparecem no diálogo. Você pode ouvir novamente clicando no botão play.
            </Typography>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Balões preenchidos: 0 / 3</Typography>
            <Typography variant="body2" sx={{ color: '#007aff' }}>0%</Typography>
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
