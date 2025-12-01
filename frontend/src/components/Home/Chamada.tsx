import { Box, Button, Typography } from '@mui/material';
import ImageCall from '../../assets/ImageWithFallback.png';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Modulo {
  id: number;
  titulo: string;
  descricao: string;
  imagemCapaUrl: string;
}

export default function Chamada() {
  const [ultimoModulo, setUltimoModulo] = useState<Modulo | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModulos = async () => {
      try {
        const response = await api.get<Modulo[]>('/modulos');
        if (response.data.length > 0) {
          setUltimoModulo(response.data[response.data.length - 1]);
        }
      } catch (error) {
        console.error("Erro ao buscar módulos:", error);
      }
    };

    fetchModulos();
  }, []);

  const handleModuleClick = async () => {
    if (user && ultimoModulo) {
      const requestUrl = `/progresso/iniciar?alunoId=${user.id}&moduloId=${ultimoModulo.id}`;
      console.log("Iniciando requisição POST para (URL completa será /api" + requestUrl + "):", requestUrl);
      try {
        const response = await api.post(requestUrl);
        console.log(`Requisição POST para ${requestUrl} bem-sucedida. Resposta:`, response.data);
      } catch (error) {
        console.error(`Requisição POST para ${requestUrl} falhou. Erro:`, error);
      }
    }
    if (ultimoModulo) {
      navigate(`/presentation/${ultimoModulo.id}`);
    }
  };

  return (
    <Box
      sx={{
        mx: 6,
        position: 'relative',
        height: '400px',
        borderRadius: '14px',
        overflow: 'hidden',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.6) 50%, rgba(0,0,0,0)), url(${ultimoModulo ? ultimoModulo.imagemCapaUrl : ImageCall})`,
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
          {ultimoModulo ? ultimoModulo.titulo : "Carregando..."}
        </Typography>
        <Typography sx={{ mb: 3, maxWidth: '500px' }}>
          {ultimoModulo ? ultimoModulo.descricao : "Descubra um novo desafio."}
        </Typography>
        {ultimoModulo && (
          <Button
            variant="contained"
            onClick={handleModuleClick}
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
        )}
      </Box>
    </Box>
  );
}