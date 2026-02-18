
import { Box, Typography, Button, TextareaAutosize, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactMarkdown from 'react-markdown';

interface ProductionTextoContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

export default function ProductionTextoContent({ data }: ProductionTextoContentProps) {
    const { markItemAsCompleted, handleNextItem } = useModule();
    const [text, setText] = useState('');
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct'>('unchecked');

    useEffect(() => {
        setText('');
        setCheckStatus('unchecked');
    }, [data.id]);

    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return null;
        let videoId;
        try {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get('v') || urlObj.pathname.slice(1);
        } catch (e) { return null; }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const isSubmittable = text.trim() !== '';

    const handleCheckAnswer = async () => {
        if (!isSubmittable) return;
        setCheckStatus('correct');
        await markItemAsCompleted(data.id, ItemType.PRODUCTION);
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Desafio de Produção - Texto Longo</Typography>
          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio</Typography>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              <ReactMarkdown>{data.instrucaoDesafio}</ReactMarkdown>
            </Typography>
          </Paper>

          {embedUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{
                    position: 'relative',
                    paddingTop: '30%',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: '720px'
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
              disabled={checkStatus === 'correct'}
              onChange={(e) => setText(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1a1a1a',
                color: '#e0e0e0',
                border: '2px solid #282828',
                borderRadius: '14px',
                padding: '16px',
                fontFamily: 'inherit',
                fontSize: '16px'
              }}
            />
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, px: 1 }}>
                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>{wordCount} palavras</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {checkStatus === 'unchecked' && (
                <Button variant="contained" size="large" onClick={handleCheckAnswer} disabled={!isSubmittable} sx={{ textTransform: 'none', borderRadius: 3 }}>
                    Enviar Desafio
                </Button>
            )}
            {checkStatus === 'correct' && (
                 <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none' }}>
                    Próximo
                </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
