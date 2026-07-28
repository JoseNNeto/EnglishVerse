import { Box, Button, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PublicIcon from '@mui/icons-material/Public';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../../contexts/GamificationContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { appPalette } from '../../theme/palette';

export default function JourneyCard() {
  const { journey, loading } = useGamification();
  const { mode } = useThemeMode();
  const colors = appPalette[mode];
  const navigate = useNavigate();

  if (loading || !journey) return null;
  const { summary, nextMission } = journey;

  return (
    <Card
      sx={{
        mx: { xs: 2, md: 6 },
        mt: 3,
        borderRadius: 4,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        background: `linear-gradient(125deg, ${colors.surfaceRaised}, ${colors.nav})`,
        overflow: 'hidden',
        position: 'relative',
        '&::after': {
          content: '""', position: 'absolute', width: 220, height: 220, borderRadius: '50%',
          border: `1px solid ${colors.xpSoft}`, right: -70, top: -110,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, position: 'relative', zIndex: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between">
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
              <AutoAwesomeIcon sx={{ color: colors.xp }} />
              <Typography variant="overline" sx={{ color: colors.xp, fontWeight: 900 }}>Sua Jornada</Typography>
            </Stack>
            <Typography variant="h5">{summary.levelName}</Typography>
            <LinearProgress
              variant="determinate" value={summary.progressPercent}
              sx={{ mt: 2, height: 10, borderRadius: 8, maxWidth: 620, bgcolor: colors.navAccent, '& .MuiLinearProgress-bar': { bgcolor: colors.xp, borderRadius: 8 } }}
            />
            <Typography variant="body2" sx={{ mt: 1, color: colors.textMuted }}>
              {summary.nextLevelName
                ? `${summary.totalXp} XP · faltam ${summary.xpToNextLevel} XP para se tornar ${summary.nextLevelName}`
                : `${summary.totalXp} XP · você alcançou o nível máximo atual`}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'row', md: 'column' }} spacing={1.2} minWidth={{ md: 220 }}>
            <Stack direction="row" spacing={1} alignItems="center"><PublicIcon color="primary" /><Typography><strong>{summary.currentStreak}</strong> days orbiting</Typography></Stack>
            <Typography variant="caption" sx={{ color: colors.textMuted }}>Recorde: {summary.longestStreak} dias</Typography>
          </Stack>
        </Stack>

        {nextMission && (
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}
            sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: colors.xpSoft, border: `1px solid ${colors.xp}` }}>
            <Box>
              <Typography variant="caption" sx={{ color: colors.xp, fontWeight: 900 }}>PRÓXIMA MISSÃO</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{nextMission.title}</Typography>
              <Typography variant="caption" sx={{ color: colors.textMuted }}>{nextMission.completedItems} de {nextMission.totalItems} etapas · até {nextMission.remainingXp} XP restantes</Typography>
            </Box>
            <Button variant="contained" startIcon={<RocketLaunchIcon />} onClick={() => navigate(`/presentation/${nextMission.moduleId}`)} sx={{ borderRadius: 3, whiteSpace: 'nowrap' }}>
              Continuar missão
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
