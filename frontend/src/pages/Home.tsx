import Chamada from '../components/Home/Chamada';
import ContinuarAprendendo from '../components/Home/ContinuarAprendendo';
import Secoes from '../components/Home/Secoes';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Modulo } from '../contexts/ModuleContext';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


// A simple card component for displaying a module, similar to the one in Secoes.tsx
const ModuleCard = ({ module }: { module: Modulo }) => (
    <Grid size={{ xs:12, sm:6, md:2.4 }}>
      <Card sx={{ 
        backgroundColor: '#1a1a1a', 
        color: 'white', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)', 
        borderRadius: '14px',
        transition: 'transform 0.3s, box-shadow 0.3s',
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
        }
      }}>
        <CardActionArea component={Link} to={`/presentation/${module.id}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            height: '270px',
            width: '100%',
            position: 'relative',
            borderRadius: '14px 14px 0 0',
            overflow: 'hidden',
            backgroundImage: `url(${module.imagemCapaUrl || 'https://via.placeholder.com/400x270'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .overlay': {
              opacity: 0,
              transition: 'opacity 0.3s',
            },
            '&:hover .overlay': {
              opacity: 1,
            },
          }}>
            <Box className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlayArrowIcon sx={{ color: 'white', fontSize: 60, backgroundColor: '#007aff', borderRadius: '50%', padding: '8px' }} />
            </Box>
          </Box>
          <CardContent sx={{ p: '16px', flexGrow: 1, overflowY: 'auto', height: '80px' }}>
            <Typography variant="body1">{module.titulo}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [searchResults, setSearchResults] = useState<Modulo[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      const fetchSearch = async () => {
        setLoading(true);
        try {
          const response = await api.get<Modulo[]>(`/modulos/search?q=${query}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error("Erro ao buscar módulos:", error);
          setSearchResults([]); // Set to empty array on error
        } finally {
          setLoading(false);
        }
      };
      fetchSearch();
    } else {
      // Clear results if there is no query
      setSearchResults(null);
    }
  }, [query]);

  // If a search is active (even if loading or no results), show the search view
  if (query) {
    return (
        <Box sx={{ my: 4, mx: 6 }}>
            <Typography variant="h5" component="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Resultados da busca por: "{query}"
            </Typography>
            {loading ? (
                <CircularProgress color="primary" sx={{display: 'block', margin: 'auto', mt: 4}} />
            ) : (
                <>
                    {searchResults && searchResults.length > 0 ? (
                        <Grid container spacing={2}>
                            {searchResults.map((module) => (
                                <ModuleCard key={module.id} module={module} />
                            ))}
                        </Grid>
                    ) : (
                        <Typography sx={{color: 'white', textAlign: 'center', mt: 4}}>
                            Nenhum módulo encontrado.
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );
  }

  // Otherwise, show the default home page content
  return (
    <>
      <Chamada />
      <ContinuarAprendendo />
      <Secoes />
    </>
  );
}

export default Home;
