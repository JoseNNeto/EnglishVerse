
import { Box, CircularProgress, Typography } from '@mui/material';
import ProgressSidebar from '../../components/Practice/PracticeMarcar/ProgressSidebar';
import PracticeContent from '../../components/Practice/PracticeMarcar/PracticeContent';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

interface PracticeAtividade {
  id: number;
  instrucao: string;
  dadosAtividade: Record<string, any>;
}

export default function PracticeMarcar() {
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
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', flexGrow: 1, p: 3, flexDirection: 'column', gap: 3 }}>
        {loading ? (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : data ? (
          <Box sx={{ flexGrow: 1 }}>
            <PracticeContent data={data} />
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography>No data available.</Typography>
          </Box>
        )}
    </Box>
  );
}
