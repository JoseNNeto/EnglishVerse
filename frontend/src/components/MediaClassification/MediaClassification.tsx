import { Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SchoolIcon from '@mui/icons-material/School';
import TvIcon from '@mui/icons-material/Tv';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

export type MediaCategory = 'FILM' | 'SERIES' | 'MUSIC' | 'POETRY' | 'COMICS';

const classifications = {
  MUSIC: {
    label: 'Música',
    shortDescription: 'Músicas, letras, videoclipes e atividades baseadas em música.',
    achievement: 'Conta para as conquistas Lyric Hunter e Culture Collector.',
    icon: MusicNoteIcon,
    color: '#f06292',
  },
  FILM: {
    label: 'Filme',
    shortDescription: 'Cenas, diálogos e atividades baseadas em filmes.',
    achievement: 'Conta para as conquistas Cosmic Cinephile e Culture Collector.',
    icon: MovieIcon,
    color: '#7e57c2',
  },
  SERIES: {
    label: 'Série',
    shortDescription: 'Episódios, cenas, diálogos e atividades baseadas em séries de TV.',
    achievement: 'Conta para Culture Collector quando houver conteúdo de séries publicado.',
    icon: TvIcon,
    color: '#5c6bc0',
  },
  POETRY: {
    label: 'Poesia',
    shortDescription: 'Poemas, versos e atividades de leitura ou escrita baseadas em poesia.',
    achievement: 'Conta para as conquistas Intergalactic Reader e Culture Collector.',
    icon: AutoStoriesIcon,
    color: '#26a69a',
  },
  COMICS: {
    label: 'Quadrinhos',
    shortDescription: 'Tirinhas, histórias em quadrinhos e atividades baseadas em arte sequencial.',
    achievement: 'Conta para as conquistas Intergalactic Reader e Culture Collector.',
    icon: CollectionsBookmarkIcon,
    color: '#ef6c00',
  },
} satisfies Record<MediaCategory, {
  label: string;
  shortDescription: string;
  achievement: string;
  icon: typeof MovieIcon;
  color: string;
}>;

const generalClassification = {
  label: 'Inglês geral',
  shortDescription: 'Prática de gramática ou idioma sem uma fonte específica de cultura pop.',
  achievement: 'Não conta para as conquistas de Cultura pop.',
  icon: SchoolIcon,
  color: '#78909c',
};

export function getMediaClassification(category?: MediaCategory | null) {
  return category ? classifications[category] : generalClassification;
}

export function MediaCategoryBadge({ category }: { category?: MediaCategory | null }) {
  const classification = getMediaClassification(category);
  const Icon = classification.icon;

  return (
    <Chip
      size="small"
      icon={<Icon />}
      label={classification.label}
      sx={{
        bgcolor: `${classification.color}22`,
        color: classification.color,
        border: `1px solid ${classification.color}66`,
        fontWeight: 800,
        '& .MuiChip-icon': { color: classification.color },
      }}
    />
  );
}

export function ActiveMediaClassification({ category }: { category?: MediaCategory | null }) {
  const classification = getMediaClassification(category);

  return (
    <Paper
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
        <Typography variant="overline" sx={{ fontWeight: 900, whiteSpace: 'nowrap' }}>
          Classificação do conteúdo
        </Typography>
        <MediaCategoryBadge category={category} />
        <Box flex={1}>
          <Typography variant="body2" color="text.secondary">
            {classification.shortDescription} {classification.achievement}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export function MediaClassificationGuide() {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography sx={{ fontWeight: 900 }}>O que conta como Cultura pop?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Procure estas etiquetas durante os estudos. Apenas conteúdos culturais classificados avançam as conquistas de Cultura pop.
      </Typography>
      <Grid container spacing={1.5}>
        {(Object.keys(classifications) as MediaCategory[]).map(category => {
          const classification = classifications[category];
          return (
            <Grid size={{ xs: 12, md: 4 }} key={category}>
              <Stack spacing={0.75} sx={{ height: '100%', p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                <MediaCategoryBadge category={category} />
                <Typography variant="body2">{classification.shortDescription}</Typography>
                <Typography variant="caption" color="text.secondary">{classification.achievement}</Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
