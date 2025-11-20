
import { Box, Typography, LinearProgress, Button, Paper, Chip } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from 'react';

const imgImageWithFallback = "https://www.figma.com/api/mcp/asset/1997493e-ee3b-4124-8ea9-c9fd6dfa8356";

const lyrics = "Walking down the street on a sunny day / I see a bird flying in the sky / An old friend waves from across the way / The world feels bright as time goes by / In the morning light we find our way / Through the city streets where children play / A new beginning starts today / The future's calling come what may";

const words = lyrics.split(/(\s+|\/)/).filter(w => w.trim() !== '');

export default function PracticeSelecionarContent() {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);

    const handleWordClick = (word: string, index: number) => {
        const wordIdentifier = `${word}-${index}`;
        if (selectedWords.includes(wordIdentifier)) {
            setSelectedWords(selectedWords.filter(w => w !== wordIdentifier));
        } else {
            setSelectedWords([...selectedWords, wordIdentifier]);
        }
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h6">Etapa 2: Prática</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Pergunta 3 de 4</Typography>
            <Typography sx={{ color: '#b3b3b3' }}>75%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                {`Ouça a música e clique em todos os Artigos ('a', 'an', 'the') que você encontrar na letra abaixo.`}
            </Typography>
            <Button
              startIcon={<LightbulbOutlinedIcon />}
              sx={{ color: '#007aff', textTransform: 'none', bgcolor: '#1a1a1a', borderRadius: 3, p: '8px 16px' }}
            >
              Dica
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, mb: 3, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Box sx={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid #282828',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}>
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/pSw8an1u3rc"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0 }}
                ></iframe>
              </Box>
            </Box>

            <Paper sx={{ flex: 2, bgcolor: '#1a1a1a', p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <MusicNoteIcon sx={{ color: '#e0e0e0' }} />
                  <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Letra da Música</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  {words.map((word, index) => (
                      word === '/' ? <Typography key={index} sx={{ color: '#e0e0e0', mx: 1 }}>/</Typography> :
                      <Chip
                          key={`${word}-${index}`}
                          label={word}
                          onClick={() => handleWordClick(word, index)}
                          sx={{
                              backgroundColor: selectedWords.includes(`${word}-${index}`) ? '#007aff' : '#282828',
                              color: 'white',
                              fontSize: '18px',
                              p: '16px 8px',
                              height: 'auto',
                              borderRadius: '10px',
                              '& .MuiChip-label': {
                                  p: '0'
                              }
                          }}
                      />
                  ))}
              </Box>
              <Box sx={{ borderTop: 1, borderColor: '#282828', mt: 2, pt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      Palavras selecionadas: <span style={{ color: '#007aff' }}>{selectedWords.length}</span>
                  </Typography>
              </Box>
            </Paper>
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
