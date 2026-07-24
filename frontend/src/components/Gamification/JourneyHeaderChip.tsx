import { Box, ButtonBase, LinearProgress, Popover, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useState } from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { appPalette } from '../../theme/palette';

export default function JourneyHeaderChip() {
  const { journey } = useGamification();
  const { mode } = useThemeMode();
  const colors = appPalette[mode];
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [orbitAnchorEl, setOrbitAnchorEl] = useState<HTMLElement | null>(null);
  const summary = journey?.summary;

  if (!summary) return null;

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <ButtonBase
          onClick={(event) => setOrbitAnchorEl(event.currentTarget)}
          aria-label="Abrir resumo dos dias em órbita"
          sx={{
            px: 0.75,
            py: 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: 0.45,
            color: colors.text,
            borderRadius: 2,
            whiteSpace: 'nowrap',
            transition: 'background-color 160ms ease',
            '&:hover': { bgcolor: colors.navAccent },
          }}
        >
          <RocketLaunchIcon color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 900 }}>
            {summary.currentStreak}
          </Typography>
          {summary.currentStreak > 0 && (
            <LocalFireDepartmentIcon sx={{ color: '#ff8a00', fontSize: 21 }} />
          )}
        </ButtonBase>
        <ButtonBase
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-label="Abrir resumo da minha jornada"
          sx={{
            px: 1.5,
            py: 0.8,
            borderRadius: 8,
            color: colors.text,
            bgcolor: colors.xpSoft,
            border: `1px solid ${colors.xp}`,
            gap: 0.8,
            transition: 'transform 160ms ease',
            '&:hover': { transform: 'translateY(-1px)' },
          }}
        >
          <AutoAwesomeIcon sx={{ color: colors.xp, fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}>
            {summary.totalXp} XP · {summary.levelName}
          </Typography>
        </ButtonBase>
      </Stack>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1.2, width: 330, borderRadius: 3, bgcolor: colors.surfaceRaised, border: `1px solid ${colors.border}` } } }}
      >
        <Stack spacing={1.5} sx={{ p: 2.5, color: colors.text }}>
          <Box>
            <Typography variant="overline" sx={{ color: colors.xp, fontWeight: 800 }}>Sua Jornada</Typography>
            <Typography variant="h6">{summary.levelName}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={summary.progressPercent}
            sx={{ height: 8, borderRadius: 8, bgcolor: colors.navAccent, '& .MuiLinearProgress-bar': { bgcolor: colors.xp } }}
          />
          <Typography variant="caption" color="text.secondary">
            {summary.nextLevelName
              ? `${summary.totalXp} / ${summary.nextLevelXp} XP · faltam ${summary.xpToNextLevel} XP para ${summary.nextLevelName}`
              : `${summary.totalXp} XP · nível máximo atual`}
          </Typography>
        </Stack>
      </Popover>
      <Popover
        open={Boolean(orbitAnchorEl)}
        anchorEl={orbitAnchorEl}
        onClose={() => setOrbitAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.2,
              width: 260,
              borderRadius: 3,
              bgcolor: colors.surfaceRaised,
              border: `1px solid ${colors.border}`,
            },
          },
        }}
      >
        <Stack spacing={1} sx={{ p: 2.25, color: colors.text }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <RocketLaunchIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Dias em órbita</Typography>
          </Stack>
          <Typography variant="body2">
            Sequência atual: <strong>{summary.currentStreak} {summary.currentStreak === 1 ? 'dia' : 'dias'}</strong>
          </Typography>
          <Typography variant="body2">
            Recorde: <strong>{summary.longestStreak} {summary.longestStreak === 1 ? 'dia' : 'dias'}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cada dia de aprendizagem mantém sua nave em movimento.
          </Typography>
        </Stack>
      </Popover>
    </>
  );
}
