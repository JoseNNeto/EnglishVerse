
import { Box, Button, Typography } from '@mui/material';
import ImageCall from '../../assets/ImageWithFallback.png'

const heroImage = "https://www.figma.com/api/mcp/asset/3ea8a474-59d4-4fa8-ba6c-eb38b6e9a995";

export default function Chamada() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '400px',
        borderRadius: '14px',
        overflow: 'hidden',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.6) 50%, rgba(0,0,0,0)), url(${ImageCall})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: 6,
      }}
    >
      <Box>
        <Typography
          sx={{
            backgroundColor: '#007aff',
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '8px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '16px',
            mb: 2,
          }}
        >
          Módulo Novo
        </Typography>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Dominando o Verbo 'To Be' com Diálogos de Friends
        </Typography>
        <Typography sx={{ mb: 3, maxWidth: '500px' }}>
          Aprenda a usar 'is', 'am' e 'are' analisando as melhores cenas de Ross, Rachel e Joey.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#007aff',
            '&:hover': { backgroundColor: '#0056b3' },
            borderRadius: '14px',
            padding: '10px 32px',
            fontWeight: 'bold',
          }}
        >
          Começar Módulo
        </Button>
      </Box>
    </Box>
  );
}
