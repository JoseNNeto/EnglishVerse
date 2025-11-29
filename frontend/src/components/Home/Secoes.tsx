import { Box, Card, CardActionArea, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Interfaces based on backend models
interface Modulo {
  id: number;
  titulo: string;
  imagemCapaUrl: string;
}

interface Topico {
  id: number;
  nome: string;
}

// Structure for the component's state
interface Section {
  title: string;
  topics: Modulo[]; // 'topics' here refers to modules, as per component structure
}

const TopicCard = ({ topic }: { topic: Modulo }) => (
  <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
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
      <CardActionArea component={Link} to={`/presentation/${topic.id}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="270"
          image={topic.imagemCapaUrl || 'https://via.placeholder.com/400x270'} // Fallback image
          alt={topic.titulo}
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
          <Typography variant="body1">{topic.titulo}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

export default function Secoes() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        // 1. Fetch all topics
        const topicosResponse = await api.get<Topico[]>('/topicos');
        const topicos = topicosResponse.data;

        // 2. Create an array of promises to fetch modules for each topic
        const modulePromises = topicos.map(topico =>
          api.get<Modulo[]>(`/modulos/topico/${topico.id}`)
        );

        // 3. Wait for all module requests to complete
        const moduleResponses = await Promise.all(modulePromises);

        // 4. Map the results to the Section[] structure
        const newSections = topicos.map((topico, index) => ({
          title: topico.nome,
          topics: moduleResponses[index].data // These are the modules
        }));

        setSections(newSections);
      } catch (error) {
        console.error("Erro ao buscar seções e módulos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) {
    return <Typography sx={{color: 'white', textAlign: 'center', my: 4}}>Carregando seções...</Typography>;
  }

  return (
    <Box sx={{ my: 4, mx: 6 }}>
      {sections.map(section => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            {section.title}
          </Typography>
          <Grid container spacing={2}>
            {section.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
