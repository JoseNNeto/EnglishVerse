import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RedeemIcon from '@mui/icons-material/Redeem';
import BadgeIcon from '@mui/icons-material/Badge';
import PortraitIcon from '@mui/icons-material/Portrait';
import { useGamification } from '../../contexts/GamificationContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { appPalette } from '../../theme/palette';
import type { RewardType, StarCapsule, StarCapsuleOpenResponse } from '../../types/gamification';

export default function StarCapsules() {
  const { journey, openStarCapsule } = useGamification();
  const { mode } = useThemeMode();
  const colors = appPalette[mode];
  const [openingId, setOpeningId] = useState<number | null>(null);
  const [opened, setOpened] = useState<StarCapsuleOpenResponse | null>(null);
  const [choosing, setChoosing] = useState<StarCapsule | null>(null);

  if (!journey) return null;
  const available = journey.starCapsules.filter(capsule => capsule.status === 'AVAILABLE');
  const openedCount = journey.starCapsules.length - available.length;

  const handleOpen = async (capsuleId: number, selectedRewardType?: RewardType) => {
    setOpeningId(capsuleId);
    setChoosing(null);
    try {
      setOpened(await openStarCapsule(capsuleId, selectedRewardType));
    } finally {
      setOpeningId(null);
    }
  };

  const requestOpen = (capsule: StarCapsule) => {
    if (capsule.earnedFrom === 'Content Mastery') {
      setChoosing(capsule);
      return;
    }
    void handleOpen(capsule.id);
  };

  const rewardHint = (capsule: StarCapsule) => {
    if (capsule.earnedFrom === 'Consistency') return '+10 XP + Orbital Shield';
    if (capsule.earnedFrom === 'Content Mastery') return '+10 XP + Title or Avatar Frame';
    return '+10 XP';
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} mb={2}>
        <Box>
          <Typography variant="h5">Star Capsules</Typography>
          <Typography variant="body2" color="text.secondary">
            Conclua todas as conquistas de uma categoria para ganhar sua cápsula. Cada uma concede +10 XP.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`${available.length} ${available.length === 1 ? 'disponível' : 'disponíveis'}`}
            color={available.length ? 'warning' : 'default'}
          />
          <Chip label={`${openedCount} ${openedCount === 1 ? 'aberta' : 'abertas'}`} variant="outlined" />
        </Stack>
      </Stack>

      {available.length === 0 ? (
        <Paper sx={{ p: 2.5, borderRadius: 3, border: `1px dashed ${colors.border}`, bgcolor: colors.surfaceRaised }}>
          <Typography color="text.secondary">
            Conclua uma categoria inteira de conquistas para desbloquear sua próxima Star Capsule.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {available.map(capsule => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={capsule.id}>
              <Paper
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  border: `1px solid ${colors.xp}`,
                  background: `linear-gradient(145deg, ${colors.xpSoft}, ${colors.surfaceRaised})`,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    bgcolor: colors.xpSoft,
                    right: -25,
                    top: -30,
                  },
                }}
              >
                <Stack spacing={1.5} alignItems="flex-start" position="relative" zIndex={1}>
                  <Box sx={{ p: 1.2, borderRadius: 3, bgcolor: colors.xp, color: '#1b1235' }}>
                    <RedeemIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={900}>{capsule.earnedFrom} Star Capsule</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Categoria concluída
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.xp, fontWeight: 800, mt: 0.5 }}>
                      {rewardHint(capsule)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<LockOpenIcon />}
                    disabled={openingId !== null}
                    onClick={() => requestOpen(capsule)}
                    sx={{ borderRadius: 3, fontWeight: 900 }}
                  >
                    {openingId === capsule.id ? 'Opening...' : 'Open Star Capsule'}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={Boolean(choosing)} onClose={() => setChoosing(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle>
          <Typography variant="h5" fontWeight={900}>Choose your Content Mastery reward</Typography>
          <Typography variant="body2" color="text.secondary">Esta escolha será adicionada à sua My Collection.</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper variant="outlined" sx={{ p: 2.5, height: '100%', borderRadius: 3 }}>
                <BadgeIcon color="warning" sx={{ fontSize: 40 }} />
                <Typography fontWeight={900} mt={1}>Verse Master</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>Um título exclusivo exibido no seu perfil.</Typography>
                <Button fullWidth variant="contained" onClick={() => choosing && void handleOpen(choosing.id, 'PROFILE_TITLE')}>Choose title</Button>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper variant="outlined" sx={{ p: 2.5, height: '100%', borderRadius: 3 }}>
                <PortraitIcon color="secondary" sx={{ fontSize: 40 }} />
                <Typography fontWeight={900} mt={1}>Cosmic Pathfinder Frame</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>Uma moldura luminosa para o avatar do seu perfil.</Typography>
                <Button fullWidth variant="contained" color="secondary" onClick={() => choosing && void handleOpen(choosing.id, 'AVATAR_FRAME')}>Choose frame</Button>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}><Button onClick={() => setChoosing(null)}>Cancel</Button></DialogActions>
      </Dialog>

      <Dialog open={Boolean(opened)} onClose={() => setOpened(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, textAlign: 'center' } }}>
        <DialogTitle sx={{ pt: 4 }}>
          <AutoAwesomeIcon color="warning" sx={{ fontSize: 64 }} />
          <Typography variant="h4" fontWeight={900}>Star Capsule opened!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" color="warning.main" fontWeight={900}>
            +{opened?.reward.xpGained ?? 0} XP
          </Typography>
          {opened?.specialReward && (
            <>
              <Typography variant="h6" fontWeight={900} mt={2}>{opened.specialReward.name}</Typography>
              <Typography color="text.secondary">{opened.specialReward.description}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => setOpened(null)} sx={{ borderRadius: 3 }}>Continue</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
