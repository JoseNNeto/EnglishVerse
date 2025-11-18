
import { Box, Typography, Button, Paper } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Descrition() {
  return (
    <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: '14px', p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 2 }}>
        Entendendo o Simple Present
      </Typography>
      <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2 }}>
        O Simple Present é usado para expressar verdades universais, fatos e situações permanentes. Nesta cena, Michael usa <Typography component="span" sx={{color: '#007aff'}}>"are"</Typography> e <Typography component="span" sx={{color: '#007aff'}}>"is"</Typography> para explicar conceitos que ele considera verdades sobre diversidade e inclusão.
      </Typography>
      <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 1 }}>
        Exemplos da cena:
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
        <Paper sx={{p: 2, backgroundColor: '#282828', color: 'white', borderRadius: '10px'}}>
            <Typography variant="body1">"We <Typography component="span" sx={{color: '#007aff'}}>are</Typography> no longer going to be using..."</Typography>
            <Typography variant="body2" sx={{color: '#b3b3b3'}}>→ Usamos "are" com pronomes plurais (we, they, you)</Typography>
        </Paper>
        <Paper sx={{p: 2, backgroundColor: '#282828', color: 'white', borderRadius: '10px'}}>
            <Typography variant="body1">"Diversity <Typography component="span" sx={{color: '#007aff'}}>is</Typography> just..."</Typography>
            <Typography variant="body2" sx={{color: '#b3b3b3'}}>→ Usamos "is" com pronomes singulares (he, she, it) e substantivos singulares</Typography>
        </Paper>
        <Paper sx={{p: 2, backgroundColor: '#282828', color: 'white', borderRadius: '10px'}}>
            <Typography variant="body1">"Inclusion <Typography component="span" sx={{color: '#007aff'}}>means</Typography> that..."</Typography>
            <Typography variant="body2" sx={{color: '#b3b3b3'}}>→ Verbos regulares na terceira pessoa do singular ganham "-s" no final</Typography>
        </Paper>
      </Box>
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={{
          backgroundColor: '#007aff',
          '&:hover': { backgroundColor: '#0056b3' },
          borderRadius: '14px',
          alignSelf: 'flex-end',
          textTransform: 'none',
          fontSize: '16px'
        }}
      >
        Entendi! Ir para o Quiz
      </Button>
    </Box>
  );
}
