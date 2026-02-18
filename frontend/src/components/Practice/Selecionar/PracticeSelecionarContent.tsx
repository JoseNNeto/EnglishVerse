import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import React, { useState, useMemo, useEffect } from 'react';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactMarkdown from 'react-markdown';

interface PracticeSelecionarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

interface SelecaoData {
    video_url: string;
    texto_base: string;
    palavras_corretas: string[];
}

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

export default function PracticeSelecionarContent({ data }: PracticeSelecionarContentProps) {
    const { markItemAsCompleted, handleNextItem } = useModule();
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');

    // Reset state when a new practice item is loaded
    useEffect(() => {
        setSelectedWords([]);
        setCheckStatus('unchecked');
    }, [data.id]);

    const selecaoData = data.dadosAtividade as SelecaoData;
    const lyrics = selecaoData.texto_base || '';
    const words = useMemo(() => lyrics.split(/(\s+|\/|,)/).filter(w => w.trim() !== ''), [lyrics]);
    const embedUrl = getYouTubeEmbedUrl(selecaoData.video_url || '');

    const correctWordTypes = useMemo(() => new Set((selecaoData.palavras_corretas || []).map(w => w.toLowerCase())), [selecaoData.palavras_corretas]);

    const correctInstanceIds = useMemo(() => {
        const ids = new Set<string>();
        words.forEach((word, index) => {
            if (correctWordTypes.has(word.toLowerCase())) {
                ids.add(`${word}-${index}`);
            }
        });
        return ids;
    }, [words, correctWordTypes]);

    const handleWordClick = (word: string, index: number) => {
        if (checkStatus !== 'unchecked') return; // Disable clicking after check
        const wordIdentifier = `${word}-${index}`;
        if (selectedWords.includes(wordIdentifier)) {
            setSelectedWords(selectedWords.filter(w => w !== wordIdentifier));
        } else {
            setSelectedWords([...selectedWords, wordIdentifier]);
        }
    };

    const handleCheckAnswer = async () => {
        const selectedIds = new Set(selectedWords);
        if (selectedIds.size === correctInstanceIds.size && [...selectedIds].every(id => correctInstanceIds.has(id))) {
            setCheckStatus('correct');
            await markItemAsCompleted(data.id, ItemType.PRACTICE);
        } else {
            setCheckStatus('incorrect');
        }
    };

    const handleTryAgain = () => {
        setCheckStatus('unchecked');
        setSelectedWords([]);
    };

    const getChipStyle = (word: string, index: number) => {
        const wordId = `${word}-${index}`;
        const isSelected = selectedWords.includes(wordId);

        if (checkStatus === 'unchecked') {
            return { backgroundColor: isSelected ? '#007aff' : '#282828', color: 'white' };
        }

        const isCorrect = correctWordTypes.has(word.toLowerCase());
        if (isSelected) {
            return { backgroundColor: isCorrect ? 'green' : 'red', color: 'white' };
        }
        return { backgroundColor: '#282828', color: 'white' };
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4">Etapa: Practice - Select Words</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3', whiteSpace: 'pre-wrap' }}>
                <ReactMarkdown>{data.instrucao}</ReactMarkdown>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, mb: 3, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, position: 'relative' }}>
              {embedUrl && (
                <Box sx={{
                    position: 'relative',
                    paddingTop: '56.25%',
                    borderRadius: '14px',
                    overflow: 'hidden',
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
              )}
            </Box>

            <Paper sx={{ flex: 2, bgcolor: '#1a1a1a', p: 2, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <MusicNoteIcon sx={{ color: '#e0e0e0' }} />
                  <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Letra</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  {words.length > 0 ? (
                      words.map((word, index) => (
                          word === '/' || word === ',' ? <Typography key={index} sx={{ color: '#e0e0e0', mx: 0.5 }}>{word}</Typography> :
                          <Chip
                              key={`${word}-${index}`}
                              label={word}
                              onClick={() => handleWordClick(word, index)}
                              sx={{
                                  ...getChipStyle(word, index),
                                  fontSize: '18px',
                                  p: '16px 8px',
                                  height: 'auto',
                                  borderRadius: '10px',
                                  '& .MuiChip-label': { p: '0' }
                              }}
                          />
                      ))
                  ) : (
                    <Typography sx={{ color: '#b3b3b3' }}>Nenhuma letra disponível.</Typography>
                  )}
              </Box>
              <Box sx={{ borderTop: 1, borderColor: '#282828', mt: 2, pt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      Palavras selecionadas: <span style={{ color: '#007aff' }}>{selectedWords.length}</span>
                  </Typography>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
            {checkStatus === 'unchecked' && (
                <>
                    {/* <Button sx={{ color: '#b3b3b3', textTransform: 'none', borderRadius: 3, p: '10px 24px' }}>
                        Pular Pergunta
                    </Button> */}
                    <Button variant="contained" onClick={handleCheckAnswer} sx={{ bgcolor: '#007aff', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
                        Verificar Resposta
                    </Button>
                </>
            )}
            {checkStatus === 'correct' && (
                <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
                    Próximo
                </Button>
            )}
            {checkStatus === 'incorrect' && (
                <Button variant="contained" onClick={handleTryAgain} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none', borderRadius: 3, p: '10px 32px' }}>
                    Tentar Novamente
                </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

