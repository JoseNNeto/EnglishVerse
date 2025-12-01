import { Box, Typography, Button, TextareaAutosize, Paper, LinearProgress } from '@mui/material';
import { useState } from 'react';
import { useModule } from '../../../contexts/ModuleContext';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

interface ProductionTextoContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
    isLast?: boolean;
}

export default function ProductionTextoContent({ data, isLast }: ProductionTextoContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted, modulo } = useModule();
    const { user } = useAuth();

    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return null;
        
        let videoId;

        try {
            const urlObj = new URL(url);

            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1);
            } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
                videoId = urlObj.searchParams.get('v');
            }
        } catch (e) {
            return null;
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');
    const [text, setText] = useState('');
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    const handleNext = () => {
        if (!activeItem) return;
        const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
        const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;
        if (hasNextItem) {
            setActiveItem(allItems[currentItemIndex + 1]);
        } else {
            if (user && modulo) {
                api.put(`/progresso/concluir?alunoId=${user.id}&moduloId=${modulo.id}`).catch(console.error);
            }
        }
    };

    const handleSubmit = () => {
        if (text.trim() === '' || !activeItem) return;
        markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);
        handleNext();
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4">Etapa: Desafio de Produção - Texto Longo</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />



          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>

            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>

              {data.instrucaoDesafio}

            </Typography>

          </Box>



          {embedUrl && (

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>

                <Box sx={{

                position: 'relative',

                paddingTop: '28.125%', 

                borderRadius: '14px',

                overflow: 'hidden',

                width: '50%',

                maxWidth: 700,

                border: '1px solid #282828',

                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'

                }}>

                <iframe

                    width="100%"

                    height="100%"

                    src={embedUrl}

                    title="YouTube video player"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

                    referrerPolicy="strict-origin-when-cross-origin"

                    allowFullScreen

                    style={{ position: 'absolute', top: 0, left: 0 }}

                ></iframe>

                </Box>

            </Box>

          )}



          <Box sx={{ mb: 3 }}>

            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>Sua Resposta:</Typography>

            <TextareaAutosize

              minRows={10}

              placeholder={"Comece a escrever sua resposta aqui..."}

              value={text}

              onChange={(e) => setText(e.target.value)}

              style={{

                width: '100%',

                backgroundColor: '#1a1a1a',

                color: '#e0e0e0',

                border: '2px solid #282828',

                borderRadius: '14px',

                padding: '8px 16px',

                fontFamily: 'inherit',

                fontSize: '16px'

              }}

            />

             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, px: 1 }}>

                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>{wordCount} palavras</Typography>

            </Box>

          </Box>



          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>

            <Button 

                variant="contained" 

                size="large" 

                sx={{ textTransform: 'none', borderRadius: 3 }}

                onClick={handleSubmit}

                disabled={text.trim() === ''}

            >

              {isLast ? 'Enviar Desafio e concluir módulo' : 'Enviar Desafio'}

            </Button>

          </Box>

        </Box>

      </Box>

    </Box>

  );

}
