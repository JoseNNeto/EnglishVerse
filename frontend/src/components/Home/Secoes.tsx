import { Box, Card, CardActionArea, CardContent, Typography, Grid, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import type { ModuleJourney } from '../../types/gamification';
import axios from 'axios';

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

interface Section {
  title: string;
  topics: Modulo[];
}

interface UltimoAcessoDTO {
  itemType: string;
  itemId: number;
  moduloId: number;
}


const TopicCard = ({ topic, journey }: { topic: Modulo, journey?: ModuleJourney }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCardClick = async () => {
    if (user && journey?.status === 'EM_ANDAMENTO') {
      try {
        const response = await api.get<UltimoAcessoDTO>(`/progresso/modulo/${topic.id}/ultimo-acesso`);
        if (response.status === 200 && response.data) {
          const { itemType, itemId } = response.data;
          // Navega para o último item acessado
          navigate(`/presentation/${topic.id}?type=${itemType}&id=${itemId}`);
        } else {
          // Se não houver último acesso (pouco provável se está em andamento, mas por segurança)
          navigate(`/presentation/${topic.id}`);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // Nenhum item foi concluído ainda, então vai para o início
          navigate(`/presentation/${topic.id}`);
        } else {
          console.error("Erro ao buscar último acesso:", error);
          navigate(`/presentation/${topic.id}`); // Fallback
        }
      }
    } else {
      // Se não estiver logado ou o módulo não estiver em andamento, vai para o início
      navigate(`/presentation/${topic.id}`);
    }
  };


  return (
    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
      <Card sx={{
        backgroundColor: (theme) => theme.palette.mode === 'light' ? '#404E7C' : '#000000',
        color: '#e0e0e0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        borderRadius: '14px',
        border: '1px solid #1b2a4a',
        transition: 'transform 0.3s, box-shadow 0.3s',
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
        }
      }}>
        <CardActionArea
          onClick={handleCardClick}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        >
          <Box sx={{
            height: '250px',
            flexShrink: 0,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: (theme) => theme.palette.mode === 'light' ? '#456379' : '#1f1f1f',
            backgroundImage: `url(${topic.imagemCapaUrl || 'https://via.placeholder.com/400x270'})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .overlay': {
              opacity: 0,
              transition: 'opacity 0.3s',
            },
            '&:hover .overlay': {
              opacity: 1,
            },
          }}>
             {journey?.status === 'EM_ANDAMENTO' && (
              <Chip label="Em andamento" color="primary" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }} />
            )}
             {journey?.status === 'CONCLUIDO' && (
              <Chip label="Concluído" color="success" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }} />
            )}
            <Box className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlayArrowIcon sx={{ color: '#000000', fontSize: 60, backgroundColor: '#a8c97f', borderRadius: '50%', padding: '8px' }} />
            </Box>
          </Box>
          <CardContent sx={{
            p: '14px 16px 16px',
            width: '100%',
            height: '100px',
            minHeight: '100px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <Typography
              variant="body1"
              sx={{
                color: '#e0e0e0',
                lineHeight: 1.3,
                minHeight: '42px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              }}
            >
              {topic.titulo}
            </Typography>
            {journey && (
              <Typography
                variant="caption"
                sx={{ color: '#b3b3b3', display: 'block', mt: 'auto', lineHeight: 1.2 }}
              >
                {journey.completedItems} de {journey.totalItems} etapas · até {journey.maximumXp} XP
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default function Secoes() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { journey } = useGamification();

  useEffect(() => {
    const fetchSectionsAndProgress = async () => {
      try {
        const topicosResponse = await api.get<Topico[]>('/topicos');
        const topicos = Array.isArray(topicosResponse.data) ? topicosResponse.data : [];

        const modulePromises = topicos.map(topico =>
          api.get<Modulo[]>(`/modulos/topico/${topico.id}`)
        );

        const moduleResponses = await Promise.all(modulePromises);

        const newSections = topicos.map((topico, index) => ({
          title: topico.nome,
          topics: moduleResponses[index].data
        }));

        setSections(newSections);
      } catch (error) {
        console.error("Erro ao buscar seções ou progressos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionsAndProgress();
  }, [user]);

  if (loading) {
    return <Typography sx={{ color: '#e0e0e0', textAlign: 'center', my: 4 }}>Carregando seções...</Typography>;
  }

  return (
    <Box sx={{ my: 4, mx: 6 }}>
      {sections.map(section => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ color: '#e0e0e0', mb: 2, fontWeight: 'bold' }}>
            {section.title}
          </Typography>
          <Grid container spacing={2}>
            {Array.isArray(section.topics) && section.topics.filter(topic => topic && topic.id).map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                journey={journey?.modules.find(item => item.moduleId === topic.id)}
              />
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
