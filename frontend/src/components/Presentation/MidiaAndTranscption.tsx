import { Box, CircularProgress, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useModule } from '../../contexts/ModuleContext';
import type { ModuleItem } from '../../contexts/ModuleContext';
import FormattedSupportText from './FormattedSupportText';

type PresentationData = Extract<ModuleItem, { type: 'presentation' }>['data'];

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    let videoId = '';
    if (hostname === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] || '';
    } else if (
      hostname === 'youtube.com'
      || hostname.endsWith('.youtube.com')
      || hostname === 'youtube-nocookie.com'
    ) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || '';
      } else {
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (['embed', 'shorts', 'live'].includes(parts[0])) videoId = parts[1] || '';
      }
    }
    return /^[A-Za-z0-9_-]{11}$/.test(videoId)
      ? `https://www.youtube.com/embed/${videoId}`
      : null;
  } catch {
    return null;
  }
}

function MediaViewer({ recurso }: { recurso: PresentationData }) {
  if (recurso.tipoRecurso === 'VIDEO') {
    if (!recurso.urlRecurso) return null;
    const embedUrl = getYouTubeEmbedUrl(recurso.urlRecurso);
    if (!embedUrl) return <Typography color="error">URL do vídeo inválida.</Typography>;
    return (
      <Box sx={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: '14px', overflow: 'hidden' }}>
        <Box
          component="iframe"
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      </Box>
    );
  }
  if (recurso.tipoRecurso === 'IMAGEM' && recurso.urlRecurso) {
    return (
      <Box
        component="img"
        src={recurso.urlRecurso}
        alt="Imagem da Presentation"
        sx={{ display: 'block', width: '100%', maxHeight: 560, objectFit: 'contain', borderRadius: '14px' }}
      />
    );
  }
  if (recurso.tipoRecurso === 'AUDIO' && recurso.urlRecurso) {
    return (
      <Paper sx={{
        p: 3,
        borderRadius: '14px',
        bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
      }}>
        <Box component="audio" controls src={recurso.urlRecurso} sx={{ display: 'block', width: '100%' }} />
      </Paper>
    );
  }
  if (recurso.tipoRecurso === 'TEXTO') return null;
  return <Typography>Mídia do tipo “{recurso.tipoRecurso}” ainda não suportada.</Typography>;
}

export default function MidiaAndTranscption() {
  const { loading, activeItem } = useModule();
  const [activeTab, setActiveTab] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [mediaHeight, setMediaHeight] = useState<number>();

  useEffect(() => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return undefined;
    const observer = new ResizeObserver(entries => {
      setMediaHeight(entries[0]?.contentRect.height);
    });
    observer.observe(mediaElement);
    return () => observer.disconnect();
  }, [activeItem?.data.id]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
  }
  if (!activeItem) {
    return <Typography sx={{ color: '#e0e0e0' }}>Nenhum item selecionado.</Typography>;
  }
  if (activeItem.type !== 'presentation') {
    return null;
  }

  const presentationData = activeItem.data;
  const supportTabs = [
    ...(presentationData.letra
      ? [{ label: 'Letra', content: presentationData.letra }]
      : []),
    ...(presentationData.transcricao
      ? [{ label: 'Transcrição', content: presentationData.transcricao }]
      : []),
  ];
  const selectedTab = Math.min(activeTab, Math.max(0, supportTabs.length - 1));
  const hasMedia = Boolean(
    presentationData.urlRecurso && presentationData.tipoRecurso !== 'TEXTO',
  );
  const showTwoColumns = hasMedia && supportTabs.length > 0;

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#e0e0e0', mb: 1, fontStyle: 'italic' }}>
        Presentation
      </Typography>
      <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 3 }}>
        Recurso: {presentationData.tipoRecurso
          ? presentationData.tipoRecurso.charAt(0).toUpperCase()
            + presentationData.tipoRecurso.slice(1).toLowerCase()
          : ''}
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: showTwoColumns
            ? 'minmax(0, 1.35fr) minmax(320px, 0.85fr)'
            : 'minmax(0, 1fr)',
        },
        alignItems: 'stretch',
        gap: 2,
      }}>
        {hasMedia && (
          <Box ref={mediaRef} sx={{ minWidth: 0 }}>
            <MediaViewer recurso={presentationData} />
          </Box>
        )}

        {supportTabs.length > 0 && (
          <Paper sx={{
            minWidth: 0,
            minHeight: { xs: 260, md: showTwoColumns ? 0 : 260 },
            height: { md: showTwoColumns && mediaHeight ? mediaHeight : 'auto' },
            maxHeight: { md: showTwoColumns && mediaHeight ? mediaHeight : 560 },
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
            color: '#e0e0e0',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            <Tabs
              value={selectedTab}
              onChange={(_event, value: number) => setActiveTab(value)}
              aria-label="Letra e transcrição"
              sx={{ borderBottom: '1px solid #444', flexShrink: 0 }}
            >
              {supportTabs.map(tab => (
                <Tab
                  key={tab.label}
                  label={tab.label}
                  sx={{ color: '#b3b3b3', textTransform: 'none', fontSize: '16px' }}
                />
              ))}
            </Tabs>
            <Box sx={{ p: 3, overflowY: 'auto' }}>
              <FormattedSupportText>
                {supportTabs[selectedTab]?.content || ''}
              </FormattedSupportText>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
