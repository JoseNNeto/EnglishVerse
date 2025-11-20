
import { Box, Typography, LinearProgress, Button, Grid } from '@mui/material';

export default function PracticeContent() {
  return (
    <Box sx={{ color: '#e0e0e0', p: 3 }}>
      <Typography variant="h6">Etapa 2: Prática (Quiz)</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Pergunta 1 de 5</Typography>
        <Typography sx={{ color: '#b3b3b3' }}>20%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={20} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

      <Box sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5">{`Complete a fala: 'Identity theft ___ not a joke, Jim!'`}</Typography>
      </Box>

      <Grid container spacing={2} paddingX={2}>
        <Grid size={{ xs:6 }} >
          <Button
            variant="outlined"
            fullWidth
            sx={{
              p: 4,
              borderColor: 'rgba(251,44,54,0.4)',
              backgroundColor: 'rgba(251,44,54,0.2)',
              color: '#e0e0e0',
              textTransform: 'none',
              borderRadius: 3,
              '&:hover': {
                borderColor: 'rgba(251,44,54,0.6)',
                backgroundColor: 'rgba(251,44,54,0.3)',
              }
            }}
          >
            <Typography variant="h6">Am</Typography>
          </Button>
        </Grid>
        <Grid size={{ xs:6 }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              p: 4,
              borderColor: 'rgba(43,127,255,0.4)',
              backgroundColor: 'rgba(43,127,255,0.2)',
              color: '#e0e0e0',
              textTransform: 'none',
              borderRadius: 3,
              '&:hover': {
                borderColor: 'rgba(43,127,255,0.6)',
                backgroundColor: 'rgba(43,127,255,0.3)',
              }
            }}
          >
          <Typography variant="h6">Is</Typography>
          </Button>
        </Grid>
        <Grid size={{ xs:6 }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              p: 4,
              borderColor: 'rgba(240,177,0,0.4)',
              backgroundColor: 'rgba(240,177,0,0.2)',
              color: '#e0e0e0',
              textTransform: 'none',
              borderRadius: 3,
              '&:hover': {
                borderColor: 'rgba(240,177,0,0.6)',
                backgroundColor: 'rgba(240,177,0,0.3)',
              }
            }}
          >
            <Typography variant="h6">Are</Typography>
          </Button>
        </Grid>
        <Grid size={{ xs:6 }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              p: 4,
              borderColor: 'rgba(0,201,80,0.4)',
              backgroundColor: 'rgba(0,201,80,0.2)',
              color: '#e0e0e0',
              textTransform: 'none',
              borderRadius: 3,
              '&:hover': {
                borderColor: 'rgba(0,201,80,0.6)',
                backgroundColor: 'rgba(0,201,80,0.3)',
              }
            }}
          >
            <Typography variant="h6">Be</Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
