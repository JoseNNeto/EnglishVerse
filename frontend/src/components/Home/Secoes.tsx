
import { Box, Card, CardActionArea, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const sections = [
  {
    title: 'Iniciante',
    topics: [
      { name: "Pronomes Pessoais Sujeito ('I', 'you', 'he' 'she', 'it', 'we', 'you', 'they')", image: "https://www.figma.com/api/mcp/asset/04b5ad06-163a-40d0-914a-c397d96b9712" },
      { name: "Presente Simples ('to be')", image: "https://www.figma.com/api/mcp/asset/5a78cb42-e2b1-4caa-8438-fa1da71531e0" },
      { name: "Artigos ('A', 'An' & 'The')", image: "https://www.figma.com/api/mcp/asset/4546e507-4d2c-40fa-a505-6de76e2faf92" },
      { name: "Presente Simples ('to have' & outros verbos)", image: "https://www.figma.com/api/mcp/asset/b12957c5-15d9-4cf6-b513-dfef2bc3af6d" },
      { name: "Advérbios de Frequência ('Always', 'Usually', 'Sometimes', 'Never' & Others)", image: "https://www.figma.com/api/mcp/asset/94f0a8b4-519c-4b22-82ea-6d6dc84c128b" },
    ]
  },
  {
    title: 'Intermediário',
    topics: [
        { name: "Pronomes Pessoais Sujeito ('I', 'you', 'he' 'she', 'it', 'we', 'you', 'they')", image: "https://www.figma.com/api/mcp/asset/04b5ad06-163a-40d0-914a-c397d96b9712" },
        { name: "Presente Simples ('to be')", image: "https://www.figma.com/api/mcp/asset/5a78cb42-e2b1-4caa-8438-fa1da71531e0" },
        { name: "Artigos ('A', 'An' & 'The')", image: "https://www.figma.com/api/mcp/asset/4546e507-4d2c-40fa-a505-6de76e2faf92" },
        { name: "Presente Simples ('to have' & outros verbos)", image: "https://www.figma.com/api/mcp/asset/b12957c5-15d9-4cf6-b513-dfef2bc3af6d" },
        { name: "Advérbios de Frequência ('Always', 'Usually', 'Sometimes', 'Never' & Others)", image: "https://www.figma.com/api/mcp/asset/94f0a8b4-519c-4b22-82ea-6d6dc84c128b" },
    ]
  },
  {
    title: 'Avançado',
    topics: [
        { name: "Pronomes Pessoais Sujeito ('I', 'you', 'he' 'she', 'it', 'we', 'you', 'they')", image: "https://www.figma.com/api/mcp/asset/04b5ad06-163a-40d0-914a-c397d96b9712" },
        { name: "Presente Simples ('to be')", image: "https://www.figma.com/api/mcp/asset/5a78cb42-e2b1-4caa-8438-fa1da71531e0" },
        { name: "Artigos ('A', 'An' & 'The')", image: "https://www.figma.com/api/mcp/asset/4546e507-4d2c-40fa-a505-6de76e2faf92" },
        { name: "Presente Simples ('to have' & outros verbos)", image: "https://www.figma.com/api/mcp/asset/b12957c5-15d9-4cf6-b513-dfef2bc3af6d" },
        { name: "Advérbios de Frequência ('Always', 'Usually', 'Sometimes', 'Never' & Others)", image: "https://www.figma.com/api/mcp/asset/94f0a8b4-519c-4b22-82ea-6d6dc84c128b" },
    ]
  }
];

type Topic = {
  name: string;
  image: string;
};

const TopicCard = ({ topic }: { topic: Topic }) => (
  <Grid size={{ xs:12, sm:6, md:2.4 }}>
    <Card sx={{ 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)', 
      borderRadius: '14px',
      transition: 'transform 0.3s, box-shadow 0.3s',
      height: '350px', // Fixed height for the card
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
      }
    }}>
      <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="270"
          image={topic.image}
          alt={topic.name}
          sx={{ borderRadius: '14px 14px 0 0', position: 'relative', flexShrink: 0 }}
        >
        </CardMedia>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '270px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s',
            '&:hover': {
              opacity: 1,
            },
            borderRadius: '14px 14px 0 0',
          }}
        >
          <PlayArrowIcon sx={{ color: 'white', fontSize: 60, backgroundColor: '#007aff', borderRadius: '50%', padding: '8px' }} />
        </Box>
        <CardContent sx={{ p: '16px', flexGrow: 1, overflowY: 'auto', height: '80px' }}>
          <Typography variant="body1">{topic.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

export default function Secoes() {
  return (
    <Box sx={{ my: 4, mx: 6 }}>
      {sections.map(section => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            {section.title}
          </Typography>
          <Grid container spacing={2}>
            {section.topics.map((topic, index) => (
              <TopicCard key={index} topic={topic} />
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
