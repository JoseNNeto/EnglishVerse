import { Avatar, Box, Card, Chip, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HubIcon from '@mui/icons-material/Hub';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { appPalette } from '../../theme/palette';
import StarCapsules from './StarCapsules';
import MyCollection from './MyCollection';
import { MediaClassificationGuide } from '../MediaClassification/MediaClassification';

const iconByKey: Record<string, typeof RocketLaunchIcon> = {
  rocket_launch: RocketLaunchIcon,
  orbit_7: PublicIcon,
  moon: NightsStayIcon,
  supernova: AutoAwesomeIcon,
  complete_orbit: CheckCircleIcon,
  constellation: HubIcon,
  cosmic_cinephile: MovieIcon,
  lyric_hunter: MusicNoteIcon,
  intergalactic_reader: MenuBookIcon,
  culture_collector: CollectionsBookmarkIcon,
  sharp_mind: PsychologyIcon,
  verse_master: WorkspacePremiumIcon,
};

const achievementCategories = [
  { code: 'CONSISTENCY', label: 'Consistency' },
  { code: 'CONTENT_MASTERY', label: 'Content Mastery' },
  { code: 'POP_CULTURE', label: 'Pop Culture' },
] as const;

const translateTimelineDescription = (description: string) => description
  .replace(/^Presentation completed/, 'Presentation concluída')
  .replace(/^Practice completed/, 'Practice concluída')
  .replace(/^Production submitted/, 'Production enviada')
  .replace(/^Production approved by teacher/, 'Production aprovada pelo professor')
  .replace(/^Practice stage completed/, 'Etapa de Practice concluída')
  .replace(/^Completed Orbit/, 'Módulo concluído')
  .replace(/^Constellation Conquered/, 'Tópico concluído')
  .replace(/^Day orbiting streak maintained/, 'Sequência de dias em órbita mantida')
  .replace(/^Star Capsule opened/, 'Star Capsule aberta')
  .replace(/^Presentation repeated for the first time \(50% XP\)/, 'Presentation refeita pela primeira vez (50% de XP)')
  .replace(/^Practice repeated for the first time \(50% XP\)/, 'Practice refeita pela primeira vez (50% de XP)')
  .replace(/^Production repeated for the first time \(50% XP\)/, 'Production refeita pela primeira vez (50% de XP)');

export default function MyJourney() {
  const { user } = useAuth();
  const { journey, loading } = useGamification();
  const { mode } = useThemeMode();
  const colors = appPalette[mode];

  if (loading) return <Typography color="text.secondary">Carregando sua jornada...</Typography>;
  if (!journey || !user) return null;
  const { summary, achievements, timeline } = journey;
  const equippedTitle = journey.inventory.find(item => item.rewardType === 'PROFILE_TITLE' && item.equipped);
  const equippedFrame = journey.inventory.find(item => item.rewardType === 'AVATAR_FRAME' && item.equipped);

  return (
    <Stack spacing={3} sx={{ width: 'min(960px, calc(100vw - 32px))' }}>
      <Card sx={{ p: 3, borderRadius: 4, color: colors.text, border: `1px solid ${colors.border}`, background: `linear-gradient(125deg, ${colors.surfaceRaised}, ${colors.nav})` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
          <Stack spacing={0.75} alignItems="center" sx={{ minWidth: 120 }}>
            <Box sx={{ p: equippedFrame ? 0.65 : 0, borderRadius: '50%', background: equippedFrame ? `linear-gradient(135deg, ${colors.xp}, ${colors.primary}, ${colors.secondary})` : 'transparent' }}>
              <Avatar sx={{ width: 88, height: 88, fontSize: '2.5rem', bgcolor: colors.primary, border: equippedFrame ? `3px solid ${colors.surfaceRaised}` : 'none' }}>{user.nome.charAt(0).toUpperCase()}</Avatar>
            </Box>
            <Typography variant="subtitle1" sx={{ maxWidth: 160, fontWeight: 800, lineHeight: 1.2, textAlign: 'center' }}>
              {user.nome}
            </Typography>
            {equippedTitle && <Chip size="small" color="warning" label={equippedTitle.name} />}
          </Stack>
          <Box flex={1}>
            <Typography variant="overline" sx={{ color: colors.xp, fontWeight: 900 }}>Minha Jornada</Typography>
            <Box
              sx={{
                mt: 0.75,
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="overline" sx={{ display: 'block', color: colors.textMuted, fontWeight: 800, lineHeight: 1 }}>
                  Current Level
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.35, fontWeight: 900, lineHeight: 1.15 }}>
                  {summary.levelName}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{summary.totalXp} XP acumulados</Typography>
            <LinearProgress variant="determinate" value={summary.progressPercent}
              sx={{ mt: 1.25, height: 10, borderRadius: 8, bgcolor: colors.navAccent, '& .MuiLinearProgress-bar': { bgcolor: colors.xp } }} />
            <Typography variant="caption" color="text.secondary">
              {summary.nextLevelName ? `Faltam ${summary.xpToNextLevel} XP para ${summary.nextLevelName}` : 'Nível máximo atual alcançado'}
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2}>
        {[
          ['Total XP', summary.totalXp, <AutoAwesomeIcon sx={{ color: colors.xp }} />],
          ['Completed modules', `${summary.modulesCompleted}/${summary.totalPublishedModules}`, <CheckCircleIcon color="success" />],
          ['Days orbiting', summary.currentStreak, <PublicIcon color="primary" />],
          ['Longest orbit', summary.longestStreak, <RocketLaunchIcon color="secondary" />],
        ].map(([label, value, icon]) => (
          <Grid size={{ xs: 6, md: 3 }} key={String(label)}>
            <Paper sx={{ p: 2, height: '100%', borderRadius: 3, border: `1px solid ${colors.border}`, bgcolor: colors.surfaceRaised }}>
              {icon}<Typography variant="h5" mt={1}>{value as string | number}</Typography><Typography variant="caption" color="text.secondary">{label as string}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box>
        <Typography variant="h5" mb={2}>Achievements</Typography>
        <Stack spacing={2.5}>
          {achievementCategories.map(category => {
            const categoryAchievements = achievements.filter(achievement => achievement.category === category.code);
            if (categoryAchievements.length === 0) return null;
            const unlockedCount = categoryAchievements.filter(achievement => achievement.unlocked).length;
            const categoryComplete = unlockedCount === categoryAchievements.length;

            return (
              <Box key={category.code}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
                  <Typography variant="subtitle1" sx={{ color: colors.textMuted, fontWeight: 800 }}>
                    {category.label}
                  </Typography>
                  <Chip
                    size="small"
                    color={categoryComplete ? 'warning' : 'default'}
                    label={categoryComplete
                      ? 'Star Capsule conquistada'
                      : `${unlockedCount}/${categoryAchievements.length}`}
                  />
                </Stack>
                {category.code === 'POP_CULTURE' && <MediaClassificationGuide />}
                <Grid container spacing={2}>
                  {categoryAchievements.map(achievement => {
                    const Icon = iconByKey[achievement.iconKey] || AutoAwesomeIcon;
                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={achievement.code}>
                        <Paper sx={{ p: 2, height: '100%', borderRadius: 3, opacity: achievement.unlocked ? 1 : 0.55, border: `1px solid ${achievement.unlocked ? colors.xp : colors.border}`, bgcolor: colors.surfaceRaised }}>
                          <Stack direction="row" spacing={1.5} alignItems="flex-start">
                            <Box sx={{ p: 1, borderRadius: '50%', bgcolor: achievement.unlocked ? colors.xpSoft : colors.navAccent, color: achievement.unlocked ? colors.xp : colors.textMuted }}>
                              {achievement.unlocked ? <Icon /> : <LockIcon />}
                            </Box>
                            <Box><Typography sx={{ fontWeight: 800 }}>{achievement.name}</Typography><Typography variant="body2" color="text.secondary">{achievement.description}</Typography></Box>
                          </Stack>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            );
          })}
        </Stack>
      </Box>

      <StarCapsules />

      <MyCollection />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h5" mb={2}>Reward Timeline</Typography>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${colors.border}`, bgcolor: colors.surfaceRaised }}>
            {timeline.length === 0 ? <Typography color="text.secondary">Sua primeira recompensa aparecerá aqui.</Typography> : (
              <Stack spacing={2}>
                {timeline.slice(0, 10).map(event => (
                  <Stack key={event.id} direction="row" spacing={1.5} alignItems="center">
                    <AutoAwesomeIcon sx={{ color: colors.xp }} />
                    <Box flex={1}><Typography variant="body2" sx={{ fontWeight: 700 }}>{translateTimelineDescription(event.description)}</Typography><Typography variant="caption" color="text.secondary">{new Date(event.eventDateTime).toLocaleString('pt-BR')}</Typography></Box>
                    <Chip label={`+${event.xpAmount} XP`} size="small" sx={{ bgcolor: colors.xpSoft, color: colors.xp, fontWeight: 900 }} />
                  </Stack>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5" mb={2}>How to Earn XP</Typography>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${colors.border}`, bgcolor: colors.surfaceRaised }}>
            <Stack spacing={1.2}>
              {[
                ['Primeira apresentação', '+10 XP'], ['Primeira prática', '+20 XP'],
                ['Etapa de prática concluída', '+20 XP'], ['Primeira produção válida', '+30 XP'],
                ['Primeira repetição de uma atividade', '50% XP'],
                ['Órbita concluída', '+50 XP'], ['Constelação conquistada', '+100 XP'],
                ['Primeira atividade do dia', '+5 XP'],
              ].map(([label, xp]) => <Stack key={label} direction="row" justifyContent="space-between"><Typography variant="body2">{label}</Typography><Typography variant="body2" sx={{ color: colors.xp, fontWeight: 900 }}>{xp}</Typography></Stack>)}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="caption" color="text.secondary">Cada dia de aprendizagem mantém sua nave em movimento. Apenas a primeira repetição de cada atividade concede 50% do XP; repetições posteriores, login e pesquisa não concedem XP.</Typography>
    </Stack>
  );
}
