
import { Box, CircularProgress, Typography } from '@mui/material';
import ProductionArquivoContent from '../../components/Production/Arquivo/ProductionArquivoContent';
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

function ProductionArquivoPageContent({data}: {data: ProductionChallenge}) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <ProductionArquivoContent data={data} />
        </Box>
    );
}

export default function ProductionArquivo() {
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
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        {data && (
          <ModuleProvider moduloId={data.modulo.id.toString()}>
            <ProductionArquivoPageContent data={data} />
          </ModuleProvider>
        )}
        {!loading && !error && !data && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography>No data available.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
