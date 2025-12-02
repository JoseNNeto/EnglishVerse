import { Box, Typography, LinearProgress, Button, Grid, TextField } from '@mui/material';
import { useState } from 'react';

// This component receives the practice data as a prop
interface PracticeListaContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}

// Assuming data structure for PracticeListaContent
interface ListaPalavrasData {
    imageUrl: string;
    numberOfInputs: number;
}

export default function PracticeListaContent({ data }: PracticeListaContentProps) {
    const listaPalavrasData = data.dadosAtividade as ListaPalavrasData;

    const [inputs, setInputs] = useState<string[]>(Array(listaPalavrasData.numberOfInputs || 3).fill(''));

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h6">Etapa: Prática - Lista de Palavras</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: 0%</Typography> {/* Placeholder */}
          </Box>
          <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 4, mb: 3 }} /> {/* Placeholder */}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              {data.instrucao}
            </Typography>
            {/* <Button
              startIcon={<LightbulbOutlinedIcon />}
              sx={{ color: '#007aff', textTransform: 'none', bgcolor: '#1a1a1a', borderRadius: 3, p: '8px 16px' }}
            >
              Dica
            </Button> */}
          </Box>

          {listaPalavrasData.imageUrl && (
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
                src={listaPalavrasData.imageUrl}
                alt="Cena da atividade"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: 700,
                  display: 'block',
                }}
              />
            </Box>
          )}

          <Box sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              {inputs.map((value, index) => (
                <Grid size={{xs: 12}} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ color: '#b3b3b3', width: '20px' }}>
                      {index + 1}.
                    </Typography>
                    <TextField
                      variant="outlined"
                      placeholder="Digite uma palavra..."
                      fullWidth
                      value={value}
                      onChange={(e) => handleInputChange(index, e.target.value)}
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
