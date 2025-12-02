
import { Box, CircularProgress, Typography } from '@mui/material';
import ProgressSidebar from '../../components/Practice/PracticeMarcar/ProgressSidebar';
import PracticeListaContent from '../../components/Practice/Lista/PracticeListaContent';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

interface PracticeAtividade {
  id: number;
  instrucao: string;
  dadosAtividade: Record<string, any>;
}

export default function PracticeLista() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PracticeAtividade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/practice/${id}`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch practice data.');
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
      <ProgressSidebar />
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : data ? (
          <PracticeListaContent data={data} />
        ) : (
          <Typography>No data available.</Typography>
        )}
      </Box>
    </Box>
  );
}
