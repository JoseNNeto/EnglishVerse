import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProgressSidebar from '../../components/Practice/PracticeMarcar/ProgressSidebar'; // Reusing the sidebar
import PracticeListaContent from '../../components/Practice/Lista/PracticeListaContent';
import api from '../../services/api';

// Copied from ModuleContext.tsx for type consistency
interface PracticeAtividade {
    id: number;
    moduloId: number;
    tipoAtividade: 'MULTIPLA_ESCOLHA' | 'PREENCHER_LACUNA' | 'SELECIONAR_PALAVRAS' | 'LISTA_PALAVRAS';
    instrucao: string;
    dadosAtividade: Record<string, any>; 
}

export default function PracticeLista() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<PracticeAtividade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) {
        setLoading(false);
        setError("Nenhum ID de atividade fornecido.");
        return;
      }

      setLoading(true);
      try {
        // Assuming the endpoint for a single practice activity is /practice/{id}
        const response = await api.get<PracticeAtividade>(`/practice/${id}`);
        setActivity(response.data);
      } catch (err) {
        console.error("Failed to fetch practice activity:", err);
        setError("Não foi possível carregar a atividade. Verifique o console para mais detalhes.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (error) {
        return <Typography color="error" sx={{ textAlign: 'center', mt: 10 }}>{error}</Typography>;
    }

    if (!activity) {
      return <Typography sx={{ textAlign: 'center', mt: 10 }}>Nenhuma atividade encontrada.</Typography>;
    }

    return <PracticeListaContent data={activity} />;
  }

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <ProgressSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {renderContent()}
      </Box>
    </Box>
  );
}