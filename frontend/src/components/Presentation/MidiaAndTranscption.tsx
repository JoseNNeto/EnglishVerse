
import { Box, Typography, Tabs, Tab, Paper, CircularProgress, LinearProgress } from '@mui/material';
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
        style={{ flexGrow: 1 }}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3, height: '100%' }}>
            {children}
          </Box>
        )}
      </div>
    );
}

export default function MidiaAndTranscption() {
    const { loading, activeItem, positionalProgressPercentage } = useModule();
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

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

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (!activeItem) {
        return <Typography sx={{color: 'white'}}>Nenhum item selecionado.</Typography>
    }

    if (activeItem.type !== 'presentation') {
        return null; 
    }

    const presentationData = activeItem.data;

    const MediaViewer = ({ recurso }: { recurso: NonNullable<typeof presentationData> }) => {
        if (recurso.tipoRecurso === 'VIDEO') {
            const embedUrl = getYouTubeEmbedUrl(recurso.urlRecurso);
            if (!embedUrl) return <Typography color="error">URL do vídeo inválida.</Typography>

            return (
                <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: '14px', overflow: 'hidden' }}>
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

    return (
        <Box>
            <Typography variant="h4" sx={{ color: '#e0e0e0' }}>
                Etapa: Apresentação
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'stretch' }}>
                <Box sx={{ flex: 1 }}>
                    <MediaViewer recurso={presentationData} />
                </Box>

                {presentationData.transcricao && (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="transcription tabs">
                                <Tab label="Transcrição" sx={{color: value === 0 ? '#007aff' : '#b3b3b3', textTransform: 'none', fontSize: '16px'}}/>
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <Paper sx={{p: 3, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', height: '100%', overflowY: 'auto'}}>
                                {presentationData.transcricao}
                            </Paper>
                        </TabPanel>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
