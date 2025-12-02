import { Box, CircularProgress, Typography } from '@mui/material';
import ProductionPostagemContent from '../../components/Production/Postagem/ProductionPostagemContent';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { ModuleProvider } from '../../contexts/ModuleContext';

interface ProductionChallenge {
  id: number;
  instrucaoDesafio: string;
  dadosDesafio: Record<string, any>;
  modulo: { id: number; nome: string; };
}

function ProductionPostagemPageContent({data}: {data: ProductionChallenge}) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <ProductionPostagemContent data={data} />
        </Box>
    );
}

export default function ProductionPostagem() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProductionChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/production/${id}`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch production data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', p: 3, justifyContent: 'center', alignItems: 'center' }}>
        {loading && (
          <CircularProgress />
        )}
        {error && (
            <Typography color="error">{error}</Typography>
        )}
        {data && (
          <ModuleProvider moduloId={data.modulo.id.toString()}>
            <ProductionPostagemPageContent data={data} />
          </ModuleProvider>
        )}
        {!loading && !error && !data && (
            <Typography>No data available.</Typography>
        )}
    </Box>
  );
}