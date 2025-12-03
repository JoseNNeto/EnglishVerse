import { Box, Card, CardContent, CardMedia, Typography, LinearProgress, CardActionArea } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StatusProgresso } from '../../contexts/ModuleContext';

// Define interfaces mirroring backend DTOs
export interface ProgressoEmAndamentoResponseDTO {
  id: number;
  alunoId: number;
  moduloId: number;
  moduloTitulo: string;
  moduloImagemCapaUrl: string;
  status: StatusProgresso;
  dataInicio: string;
  dataConclusao: string | null;
  totalItens: number;
  itensConcluidos: number;
}

interface UltimoAcessoDTO {
  itemType: string;
  itemId: number;
  moduloId: number;
}

export default function ContinuarAprendendo() {
  const { user, isAuthenticated } = useAuth();
  const [progressoModulos, setProgressoModulos] = useState<ProgressoEmAndamentoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgresso = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const response = await api.get<ProgressoEmAndamentoResponseDTO[]>(`/progresso/em-andamento/${user.id}`);
          const data = Array.isArray(response.data) ? response.data : [];
          setProgressoModulos(data);
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

  const handleCardClick = async (moduloId: number) => {
    try {
      const response = await api.get<UltimoAcessoDTO>(`/progresso/modulo/${moduloId}/ultimo-acesso`);
      if (response.status === 200 && response.data) {
        const { itemType, itemId } = response.data;
        navigate(`/presentation/${moduloId}?type=${itemType}&id=${itemId}`);
      } else {
        navigate(`/presentation/${moduloId}`);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        navigate(`/presentation/${moduloId}`);
      } else {
        console.error("Erro ao buscar último acesso:", error);
        navigate(`/presentation/${moduloId}`); // Fallback
      }
    }
  };

  if (loading) {
    return null;
  }

  if (progressoModulos.length === 0) {
    return null;
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
              minWidth: 320,
              maxWidth: 320,
              height: 160,
              flexShrink: 0,
            }}>
              <CardActionArea onClick={() => handleCardClick(item.moduloId)} sx={{ display: 'flex', height: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 160, height: '100%', objectFit: 'cover' }}
                  image={item.moduloImagemCapaUrl || 'https://via.placeholder.com/160'}
                  alt={item.moduloTitulo}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="body1">
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