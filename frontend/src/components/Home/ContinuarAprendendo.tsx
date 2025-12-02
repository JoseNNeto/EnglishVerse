import { Box, Card, CardContent, CardMedia, Typography, LinearProgress, CardActionArea } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { StatusProgresso } from '../../contexts/ModuleContext'; // Assuming StatusProgresso is exported from ModuleContext

// Define the interface mirroring the backend DTO
export interface ProgressoEmAndamentoResponseDTO {
  id: number;
  alunoId: number;
  moduloId: number;
  moduloTitulo: string;
  moduloImagemCapaUrl: string;
  status: StatusProgresso; // Use the actual enum if available, or string
  dataInicio: string;
  dataConclusao: string | null;
  totalItens: number;
  itensConcluidos: number;
}

export default function ContinuarAprendendo() {
  const { user, isAuthenticated } = useAuth();
  const [progressoModulos, setProgressoModulos] = useState<ProgressoEmAndamentoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgresso = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const response = await api.get<ProgressoEmAndamentoResponseDTO[]>(`/progresso/em-andamento/${user.id}`);
          setProgressoModulos(response.data);
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
        {progressoModulos.map((item) => {
          const progressoPercentual = item.totalItens > 0
            ? (item.itensConcluidos / item.totalItens) * 100
            : 0;

          return (
            <Card key={item.id} sx={{
              display: 'flex',
              backgroundColor: '#1a1a1a',
              color: 'white',
              borderRadius: '14px',
              minWidth: 320, // Increased width
              maxWidth: 320, // Increased width
              height: 160,
              flexShrink: 0, // Prevent shrinking in flex container
            }}>
              <CardActionArea component={Link} to={`/presentation/${item.moduloId}`} sx={{ display: 'flex', height: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 160, height: '100%', objectFit: 'cover' }}
                  image={item.moduloImagemCapaUrl || 'https://via.placeholder.com/160'} // Fallback image
                  alt={item.moduloTitulo}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="body1"> {/* Changed from h6 to body1 */}
                      {item.moduloTitulo}
                    </Typography>
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <LinearProgress variant="determinate" value={progressoPercentual} sx={{
                        height: 4,
                        borderRadius: 5,
                        backgroundColor: '#282828',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#007aff'
                        }
                      }} />
                      <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 1 }}>
                        {progressoPercentual.toFixed(0)}% completo
                      </Typography>
                    </Box>
                  </CardContent>
                </Box>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}