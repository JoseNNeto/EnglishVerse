import { Box, Button, Paper, Typography } from '@mui/material';

function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    let videoId = '';
    if (hostname === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] || '';
    } else if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) {
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

export default function ActivityMedia({
  url,
  title = 'Mídia da atividade',
}: {
  url?: string | null;
  title?: string;
}) {
  if (!url) return null;
  const embedUrl = youtubeEmbedUrl(url);
  const cleanPath = url.split(/[?#]/)[0].toLowerCase();
  const isImage = /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/.test(cleanPath);
  const isAudio = /\.(aac|flac|m4a|mp3|ogg|wav)$/.test(cleanPath);
  const isVideo = /\.(m4v|mov|mp4|mpeg|ogv|webm)$/.test(cleanPath);
  const isPdf = /\.pdf$/.test(cleanPath);

  if (embedUrl) {
    return (
      <Box sx={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
        <Box component="iframe" src={embedUrl} title={title} allowFullScreen
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
      </Box>
    );
  }
  if (isImage) {
    return (
      <Box component="img" src={url} alt={title}
        sx={{ display: 'block', width: '100%', maxHeight: 560, objectFit: 'contain', borderRadius: 3, mb: 3 }} />
    );
  }
  if (isAudio) {
    return (
      <Paper sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
      }}>
        <Box component="audio" src={url} controls sx={{ display: 'block', width: '100%' }} />
      </Paper>
    );
  }
  if (isVideo) {
    return (
      <Box component="video" src={url} controls
        sx={{ display: 'block', width: '100%', maxHeight: 620, borderRadius: 3, mb: 3 }} />
    );
  }

  return (
    <Paper sx={{
      p: 2,
      mb: 3,
      borderRadius: 3,
      bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
    }}>
      <Typography sx={{ mb: 1 }}>{isPdf ? 'Material em PDF' : title}</Typography>
      <Button component="a" href={url} target="_blank" rel="noreferrer" variant="outlined">
        Abrir arquivo
      </Button>
    </Paper>
  );
}
