import { Box, Typography, LinearProgress, Button, Grid } from '@mui/material';
import { useState } from 'react';

// This component receives the practice data as a prop
// The type is inferred from the parent 'ModuleItemViewer'
interface PracticeMarcarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}

// Assuming data structure for PracticeMarcarContent
interface MarcarData {
    pergunta: string;
    opcoes: string[];
}

export default function PracticeMarcarContent({ data }: PracticeMarcarContentProps) {
    const marcarData = data.dadosAtividade as MarcarData;
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <Box sx={{ color: '#e0e0e0', p: 3 }}>
      <Typography variant="h6">Etapa: Prática - Múltipla Escolha</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: 0%</Typography> {/* Placeholder */}
      </Box>
      <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 4, mb: 3 }} /> {/* Placeholder */}

      <Box sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5">{marcarData.pergunta || data.instrucao}</Typography>
      </Box>

      <Grid container spacing={2} paddingX={2}>
        {marcarData.opcoes && marcarData.opcoes.map((option, index) => (
            <Grid size={{ xs:6 }} key={index}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setSelectedOption(option)}
                    sx={{
                        p: 4,
                        borderColor: selectedOption === option ? '#007aff' : '#282828',
                        backgroundColor: selectedOption === option ? 'rgba(0,122,255,0.2)' : 'rgba(40,40,40,0.4)',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: 3,
                        '&:hover': {
                            borderColor: selectedOption === option ? '#007aff' : '#b3b3b3',
                            backgroundColor: selectedOption === option ? 'rgba(0,122,255,0.3)' : 'rgba(40,40,40,0.6)',
                        }
                    }}
                >
                    <Typography variant="h6">{option}</Typography>
                </Button>
            </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
            <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>
              Pular Pergunta
            </Button>
            <Button variant="contained" sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
              Verificar Resposta
            </Button>
          </Box>
    </Box>
  );
}
