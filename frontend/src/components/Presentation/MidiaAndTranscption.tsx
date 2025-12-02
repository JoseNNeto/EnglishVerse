import { Box, Typography, Tabs, Tab, Paper, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useModule } from '../../contexts/ModuleContext';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number; }) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

export default function MidiaAndTranscption() {
    const { loading, activeItem } = useModule();
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    // --- Helper Functions moved inside the component ---
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
    // --- End of Helper Functions ---


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
                <Box sx={{ flex: 1 }}>
                    <MediaViewer recurso={presentationData} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}> {/* minWidth 0 for flex item to shrink */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="transcription tabs">
                            <Tab label="Transcrição" sx={{color: value === 0 ? '#007aff' : '#b3b3b3', textTransform: 'none', fontSize: '16px'}}/>
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        {presentationData.transcricao ? (
                            <Paper sx={{p: 3, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', maxHeight: '500px', overflowY: 'auto' }}>
                                {presentationData.transcricao}
                            </Paper>
                        ) : (
                            <Typography sx={{color: '#b3b3b3', p: 3}}>Nenhuma transcrição disponível para este recurso.</Typography>
                        )}
                    </TabPanel>
                </Box>
            </Box>
        </Box>
    );
}
