import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionTextoContent from '../../components/Production/Texto/ProductionTextoContent';
import api from '../../services/api';

interface ProductionChallenge {
    id: number;
    moduloId: number;
    instrucaoDesafio: string;
    midiaDesafioUrl?: string;
    dadosDesafio: Record<string, any>;
}

export default function ProductionTexto() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ProductionChallenge | null>(null);
  const [allChallenges, setAllChallenges] = useState<ProductionChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingAllChallenges, setFetchingAllChallenges] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) {
        setLoading(false);
        setError("Nenhum ID de desafio fornecido.");
        return;
      }

      setLoading(true);
      try {
        const response = await api.get<ProductionChallenge>(`/api/production/${id}`);
        setChallenge(response.data);
      } catch (err) {
        console.error("Falha ao buscar o desafio de produção:", err);
        setError("Não foi possível carregar o desafio. Verifique o console para mais detalhes.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  useEffect(() => {
    const fetchAllChallenges = async () => {
      if (!challenge?.moduloId) {
        setFetchingAllChallenges(false);
        return;
      }

      setFetchingAllChallenges(true);
      try {
        const response = await api.get<ProductionChallenge[]>(`/api/production/modulo/${challenge.moduloId}`);
        setAllChallenges(response.data.sort((a, b) => a.id - b.id));
      } catch (err) {
        console.error("Falha ao buscar todos os desafios do módulo:", err);
      } finally {
        setFetchingAllChallenges(false);
      }
    };

    if (challenge) {
      fetchAllChallenges();
    }
  }, [challenge]);

  const isLast = !loading && !fetchingAllChallenges && challenge && allChallenges.length > 0
    ? challenge.id === allChallenges[allChallenges.length - 1].id
    : false;

  const renderContent = () => {
    if (loading || fetchingAllChallenges) {
      return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (error) {
        return <Typography color="error" sx={{ textAlign: 'center', mt: 10 }}>{error}</Typography>;
    }

    if (!challenge) {
      return <Typography sx={{ textAlign: 'center', mt: 10 }}>Nenhum desafio encontrado.</Typography>;
    }

    return <ProductionTextoContent data={challenge} isLast={isLast} />;
  }

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProductionSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {renderContent()}
      </Box>
    </Box>
  );
}