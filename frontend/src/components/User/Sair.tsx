
import { Box, Typography, Button } from '@mui/material';

export default function Sair() {
  return (
    <Box sx={{ width: '636px' }}>
      <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>
        Sair
      </Typography>
      <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2 }}>
        Isso irá desconectar você do English Verse em todos os seus dispositivos.
      </Typography>
      <Button
        variant="outlined"
        sx={{
          borderColor: '#e53935',
          color: '#e53935',
          borderRadius: '14px',
          width: '100%',
          '&:hover': {
            borderColor: '#e53935',
            backgroundColor: 'rgba(229, 57, 53, 0.1)',
          },
        }}
      >
        Sair da Conta
      </Button>
    </Box>
  );
}
