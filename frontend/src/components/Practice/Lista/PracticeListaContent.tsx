
import { Box, Typography, LinearProgress, Button, Grid, TextField } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

// Temporary image import for development, will be replaced with dynamic content
const imgImageWithFallback = "https://www.figma.com/api/mcp/asset/3e10356c-c9b8-400e-8ab7-81e5e0b2dce1";

export default function PracticeListaContent() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: '90%' }}> {/* Using 'md' for now as initial interpretation */}
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h6">Etapa 2: Prática</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Pergunta 2 de 4</Typography>
            <Typography sx={{ color: '#b3b3b3' }}>50%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={50} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              Observe a imagem da cena e digite 3 advérbios de frequência que você poderia usar para descrevê-la.
            </Typography>
            {/* <Button
              startIcon={<LightbulbOutlinedIcon />}
              sx={{ color: '#007aff', textTransform: 'none', bgcolor: '#1a1a1a', borderRadius: 3, p: '8px 16px' }}
            >
              Dica
            </Button> */}
          </Box>

          <Box
            sx={{
              borderRadius: '14px',
              overflow: 'hidden',
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'grey.800', // Placeholder background
            }}
          >
            <Box
              component="img"
              src={imgImageWithFallback}
              alt="Cena de The Office"
              sx={{
                width: '100%', // Adjust as needed
                height: 'auto',
                maxWidth: 700, // Matching the video player's size
                display: 'block',
              }}
            />
          </Box>

          <Box sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              {[1, 2, 3].map((num) => (
                <Grid size={{ xs: 12 }} key={num}> {/* Using xs={12} to make each item take full width */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ color: '#b3b3b3', width: '20px' }}>
                      {num}.
                    </Typography>
                    <TextField
                      variant="outlined"
                      placeholder="Digite uma palavra..."
                      fullWidth
                      sx={{
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
                          height: '52px',
                        },
                        '& .MuiInputBase-input': {
                          p: '12px 16px',
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
            <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>
              Pular Pergunta
            </Button>
            <Button variant="contained" sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px', opacity: 0.5 }}>
              Verificar Resposta
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
