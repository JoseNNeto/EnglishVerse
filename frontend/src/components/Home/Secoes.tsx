import { Box, Card, CardActionArea, CardContent, Typography, Grid, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

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

interface Progresso {
    id: number;
    alunoId: number;
    modulo: Modulo;
    status: string;
    dataInicio: string;
    dataConclusao: string | null;
    percentual: number;
}

interface UltimoAcessoDTO {
  itemType: string;
  itemId: number;
  moduloId: number;
}


const TopicCard = ({ topic, isEmAndamento }: { topic: Modulo, isEmAndamento: boolean }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleCardClick = async () => {
    if (user && isEmAndamento) {
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
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
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
        backgroundColor: '#1a1a1a',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        borderRadius: '14px',
        transition: 'transform 0.3s, box-shadow 0.3s',
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
        }
      }}>
        <CardActionArea onClick={handleCardClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            height: '270px',
            width: '100%',
            position: 'relative',
            borderRadius: '14px 14px 0 0',
            overflow: 'hidden',
            backgroundImage: `url(${topic.imagemCapaUrl || 'https://via.placeholder.com/400x270'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
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
             {isEmAndamento && (
              <Chip label="Em Andamento" color="primary" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }} />
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
              <PlayArrowIcon sx={{ color: 'white', fontSize: 60, backgroundColor: '#007aff', borderRadius: '50%', padding: '8px' }} />
            </Box>
          </Box>
          <CardContent sx={{ p: '16px', flexGrow: 1, overflowY: 'auto', height: '80px' }}>
            <Typography variant="body1">{topic.titulo}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default function Secoes() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [progressos, setProgressos] = useState<Progresso[]>([]);

  useEffect(() => {
    const fetchSectionsAndProgress = async () => {
      try {
        // Fetch progressos em andamento se o usuário estiver logado
        if (user) {
          const progressoResponse = await api.get<Progresso[]>(`/progresso/em-andamento/${user.id}`);
          setProgressos(progressoResponse.data);
        }

        const topicosResponse = await api.get<Topico[]>('/topicos');
        const topicos = topicosResponse.data;

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
    return <Typography sx={{ color: 'white', textAlign: 'center', my: 4 }}>Carregando seções...</Typography>;
  }

  const modulosEmAndamentoIds = new Set(progressos.filter(p => p.modulo).map(p => p.modulo.id));

  return (
    <Box sx={{ my: 4, mx: 6 }}>
      {sections.map(section => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            {section.title}
          </Typography>
          <Grid container spacing={2}>
            {Array.isArray(section.topics) && section.topics.filter(topic => topic && topic.id).map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isEmAndamento={modulosEmAndamentoIds.has(topic.id)}
              />
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
