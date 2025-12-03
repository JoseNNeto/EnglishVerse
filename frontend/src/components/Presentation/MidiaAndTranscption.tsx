import { Box, Typography, Tabs, Tab, Paper, CircularProgress } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useModule } from '../../contexts/ModuleContext';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number; parentMaxHeight?: number; }) {
    const { children, value, index, parentMaxHeight, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3, maxHeight: parentMaxHeight ? parentMaxHeight - 48 : undefined, overflowY: 'auto' }}> {/* Adjusted for Tabs height */}
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

export default function MidiaAndTranscption() {
    const { loading, activeItem } = useModule();
    const [value, setValue] = useState(0);
    const mediaRef = useRef<HTMLDivElement>(null);
    const [mediaHeight, setMediaHeight] = useState<number | undefined>(undefined);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setMediaHeight(entry.contentRect.height);
                console.log('Measured Media Height:', entry.contentRect.height);
            }
        });

        if (mediaRef.current) {
            observer.observe(mediaRef.current);
        }

        return () => {
            if (mediaRef.current) {
                observer.unobserve(mediaRef.current);
            }
        };
    }, []);

    const getYouTubeEmbedUrl = (url: string) => {
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

    const MediaViewer = ({ recurso }: { recurso: NonNullable<typeof presentationData> }) => {
        if (recurso.tipoRecurso === 'VIDEO') {
            const embedUrl = getYouTubeEmbedUrl(recurso.urlRecurso);
            if (!embedUrl) return <Typography color="error">URL do vídeo inválida.</Typography>

            return (
                <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: '14px', overflow: 'hidden', mb: 3 }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    ></iframe>
                </Box>
            );
        }
        return <Typography>Mídia do tipo '{recurso.tipoRecurso}' ainda não suportada.</Typography>
    }

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (!activeItem) {
        return <Typography sx={{color: 'white'}}>Nenhum item selecionado.</Typography>
    }

    if (activeItem.type !== 'presentation') {
        return (
            <Box sx={{ p: 4, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', textAlign: 'center' }}>
                <Typography variant="h5">Conteúdo de '{activeItem.type}'</Typography>
                <Typography>A integração para este tipo de conteúdo será feita a seguir.</Typography>
            </Box>
        );
    }

    const presentationData = activeItem.data;

    return (
        <Box>
            <Typography variant="h4" sx={{ color: '#e0e0e0', mb: 1 }}>
                Etapa: Apresentação
            </Typography>
            <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 3 }}>
                Recurso: {presentationData.tipoRecurso
                    ? presentationData.tipoRecurso.charAt(0).toUpperCase() + presentationData.tipoRecurso.slice(1).toLowerCase()
                    : ''
                }
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box sx={{ flex: 1 }} ref={mediaRef}>
                    <MediaViewer recurso={presentationData} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: mediaHeight,  }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                        <Tabs value={value} onChange={handleChange} aria-label="lyrics and transcription tabs">
                            <Tab label="Letra" sx={{color: value === 0 ? '#007aff' : '#b3b3b3', textTransform: 'none', fontSize: '16px'}}/>
                            {/* <Tab label="Transcrição" sx={{color: value === 1 ? '#007aff' : '#b3b3b3', textTransform: 'none', fontSize: '16px'}}/> */}
                        </Tabs>
                    </Box>
                    <Box sx={{ overflowY: 'auto', maxHeight:"40vh" }}>
                        <TabPanel value={value} index={0}>
                            {presentationData.letra ? (
                                <Paper sx={{px: 2, py: 0.5, backgroundColor: 'transparent', color: 'white' }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{presentationData.letra}</ReactMarkdown>
                                </Paper>
                            ) : (
                                <Typography sx={{color: '#b3b3b3', p: 3}}>Nenhuma letra disponível para este recurso.</Typography>
                            )}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {presentationData.transcricao ? (
                                <Paper sx={{p: 3, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px' }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{presentationData.transcricao}</ReactMarkdown>
                                </Paper>
                            ) : (
                                <Typography sx={{color: '#b3b3b3', p: 3}}>Nenhuma transcrição disponível para este recurso.</Typography>
                            )}
                        </TabPanel>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
