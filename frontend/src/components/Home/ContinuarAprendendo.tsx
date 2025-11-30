import { Box, Card, CardContent, CardMedia, Typography, LinearProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Modulo {
  id: number;
  titulo: string;
  imagemCapaUrl?: string; // Optional, as it might not always be present
}

interface Progresso {
  id: number;
  modulo: Modulo;
  status: string; // Assuming StatusProgresso is a string enum
  dataInicio: string; // Or Date, depending on how you want to parse
  // Assuming a progress percentage can be derived or will be provided by backend
  // For now, let's add a dummy one or calculate based on dummy
  progressoPercentual: number; // Placeholder for now, needs real calculation later
}

export default function ContinuarAprendendo() {
  const { user, isAuthenticated } = useAuth();
  const [progressoModulos, setProgressoModulos] = useState<Progresso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgresso = async () => {
      if (isAuthenticated && user?.id) {
        try {
          // TODO: O backend precisa fornecer o progresso percentual ou teremos que calcular no frontend
          // Por enquanto, vou usar um valor mockado para simular o progresso
          const response = await api.get<Progresso[]>(`/progresso/em-andamento/${user.id}`);
          const dataWithMockProgress = response.data.map(item => ({
            ...item,
            progressoPercentual: Math.floor(Math.random() * 100) // Mock progress
          }));
          setProgressoModulos(dataWithMockProgress);
        } catch (error) {
          console.error("Erro ao buscar progresso do usuário:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProgresso();
  }, [isAuthenticated, user?.id]);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (progressoModulos.length === 0) {
    return null; // Hide the section if no modules in progress
  }

  return (
    <Box sx={{ my: 4, mx: 6 }}>
      <Typography variant="h5" component="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
        Continuar Aprendendo
      </Typography>
      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 2 }}>
        {progressoModulos.map((item) => (
          <Card key={item.id} sx={{ display: 'flex', backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', minWidth: 400, height: 160 }}>
            <CardMedia
              component="img"
              sx={{ width: 160, height: 160, objectFit: 'cover' }}
              image={item.modulo.imagemCapaUrl || 'https://via.placeholder.com/160'} // Fallback image
              alt={item.modulo.titulo}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h6">
                  {item.modulo.titulo}
                </Typography>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={item.progressoPercentual} sx={{
                    height: 4,
                    borderRadius: 5,
                    backgroundColor: '#282828',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#007aff'
                    }
                  }} />
                  <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 1 }}>
                    {item.progressoPercentual}% completo
                  </Typography>
                </Box>
                <Link to={`/presentation/${item.modulo.id}`} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: '#007aff', mt: 1, cursor: 'pointer' }}>
                    Continuar
                  </Typography>
                </Link>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}