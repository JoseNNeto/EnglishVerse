import { Box, Card, CardContent, CardMedia, Typography, LinearProgress } from '@mui/material';

const learningItems = [
  {
    title: "Pronomes Pessoais Sujeito - Iniciante",
    progress: 60,
    image: "https://www.figma.com/api/mcp/asset/04b5ad06-163a-40d0-914a-c397d96b9712"
  },
  {
    title: "Presente Simples ('to be') - Intermediário",
    progress: 35,
    image: "https://www.figma.com/api/mcp/asset/5a78cb42-e2b1-4caa-8438-fa1da71531e0"
  },
  {
    title: "Artigos ('A', 'An' & 'The') - Avançado",
    progress: 15,
    image: "https://www.figma.com/api/mcp/asset/4546e507-4d2c-40fa-a505-6de76e2faf92"
  },
  {
    title: "Presente Simples ('to be') - Intermediário",
    progress: 35,
    image: "https://www.figma.com/api/mcp/asset/5a78cb42-e2b1-4caa-8438-fa1da71531e0"
  },
  {
    title: "Artigos ('A', 'An' & 'The') - Avançado",
    progress: 15,
    image: "https://www.figma.com/api/mcp/asset/4546e507-4d2c-40fa-a505-6de76e2faf92"
  },
];

export default function ContinuarAprendendo() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
        Continuar Aprendendo
      </Typography>
      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 2 }}>
        {learningItems.map((item, index) => (
          <Card key={index} sx={{ display: 'flex', backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', minWidth: 400, height: 160 }}>
            <CardMedia
              component="img"
              sx={{ width: 160, height: 160, objectFit: 'cover' }}
              image={item.image}
              alt={item.title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h6">
                  {item.title}
                </Typography>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={item.progress} sx={{
                    height: 4,
                    borderRadius: 5,
                    backgroundColor: '#282828',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#007aff'
                    }
                  }} />
                  <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 1 }}>
                    {item.progress}% completo
                  </Typography>
                </Box>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}