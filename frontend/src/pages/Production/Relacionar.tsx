
import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductionSidebar from '../../components/Production/ProductionSidebar';
import ProductionRelacionarContent from '../../components/Production/Relacionar/ProductionRelacionarContent';
import api from '../../services/api';

interface ProductionChallenge {
    id: number;
    moduloId: number; // Added moduloId to interface
    instrucaoDesafio: string;
    midiaDesafioUrl?: string;
    dadosDesafio: Record<string, any>;
}

export default function ProductionRelacionar() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ProductionChallenge | null>(null);
  const [allChallenges, setAllChallenges] = useState<ProductionChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingAllChallenges, setFetchingAllChallenges] = useState(true); // New loading state
  const [error, setError] = useState<string | null>(null);

  // Fetch individual challenge
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

  // Fetch all challenges for the module once individual challenge is loaded and has moduloId
  useEffect(() => {
    const fetchAllChallenges = async () => {
      if (!challenge?.moduloId) {
        setFetchingAllChallenges(false); // No moduloId to fetch all challenges
        return;
      }

      setFetchingAllChallenges(true);
      try {
        const response = await api.get<ProductionChallenge[]>(`/api/production/modulo/${challenge.moduloId}`);
        setAllChallenges(response.data.sort((a, b) => a.id - b.id)); // Assuming challenges are ordered by ID
      } catch (err) {
        console.error("Falha ao buscar todos os desafios do módulo:", err);
        // Don't set error here as it's not critical for displaying the current challenge
      } finally {
        setFetchingAllChallenges(false);
      }
    };

    if (challenge) { // Only fetch all challenges if the individual challenge has been loaded
      fetchAllChallenges();
    }
  }, [challenge]); // Depend on challenge to re-fetch when moduloId becomes available

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

    return <ProductionRelacionarContent data={challenge} isLast={isLast} />;
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
