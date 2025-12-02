
import { Box, CircularProgress, Typography } from '@mui/material';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionOuvirTextoContent from '../../components/Production/OuvirTexto/ProductionOuvirTextoContent';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

interface ProductionChallenge {
  id: number;
  instrucaoDesafio: string;
  midiaDesafioUrl?: string;
  dadosDesafio: Record<string, any>;
}

export default function ProductionOuvirTexto() {
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
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : data ? (
          <ProductionOuvirTextoContent data={data} />
        ) : (
          <Typography>No data available.</Typography>
        )}
      </Box>
    </Box>
  );
}
