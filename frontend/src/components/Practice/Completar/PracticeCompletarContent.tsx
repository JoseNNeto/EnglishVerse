
import { Box, Typography, LinearProgress, Button, Grid, TextField, InputAdornment } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

export default function PracticeCompletarContent() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h6">Etapa 2: Prática</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Pergunta 1 de 4</Typography>
            <Typography sx={{ color: '#b3b3b3' }}>25%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={25} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              Assista à cena novamente e complete a frase dita pelo personagem.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                  src="https://www.youtube.com/embed/Vmb1tqYqyII"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0 }}
              ></iframe>
            </Box>
          </Box>

          <Box sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
                {`"Identity theft`}
              </Typography>
              <TextField
                variant="outlined"
                value="is"
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
                  width: '217px' // This should be dynamic based on content or parent
                }}
                InputProps={{
                  // You can add an end adornment if needed based on the Figma
                }}
              />
              <Typography variant="h6" sx={{ color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
                {`not a joke, Jim!"`}
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
