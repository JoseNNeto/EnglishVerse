import { Alert, Box, Chip, IconButton, Paper, Snackbar, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useThemeMode } from './ThemeContext';
import { appPalette } from '../theme/palette';
import type { GamificationJourney, GamificationReward, RewardType, StarCapsuleOpenResponse, UserRewardItem } from '../types/gamification';

interface GamificationContextValue {
  journey: GamificationJourney | null;
  loading: boolean;
  refreshJourney: () => Promise<void>;
  applyReward: (reward: GamificationReward, fallbackLabel?: string) => void;
  openStarCapsule: (capsuleId: number, selectedRewardType?: RewardType) => Promise<StarCapsuleOpenResponse>;
  equipInventoryItem: (itemId: number) => Promise<UserRewardItem>;
}

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

interface XpNotice {
  xpGained: number;
  description: string;
  achievementNames: string[];
  specialReward?: string;
}

const translateRewardDescription = (description?: string, fallback = 'Atividade concluída') => {
  if (!description) return fallback;
  return description
    .replace(/^Presentation completed/, 'Presentation concluída')
    .replace(/^Practice completed/, 'Practice concluída')
    .replace(/^Production submitted/, 'Production enviada')
    .replace(/^Practice stage completed/, 'Etapa de Practice concluída')
    .replace(/^Completed Orbit/, 'Módulo concluído')
    .replace(/^Constellation Conquered/, 'Tópico concluído')
    .replace(/^Presentation repeated for the first time \(50% XP\)/, 'Presentation refeita pela primeira vez')
    .replace(/^Practice repeated for the first time \(50% XP\)/, 'Practice refeita pela primeira vez')
    .replace(/^Production repeated for the first time \(50% XP\)/, 'Production refeita pela primeira vez');
};

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { mode } = useThemeMode();
  const colors = appPalette[mode];
  const [journey, setJourney] = useState<GamificationJourney | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [xpNotice, setXpNotice] = useState<XpNotice | null>(null);
  const [xpNoticeOpen, setXpNoticeOpen] = useState(false);

  const refreshJourney = useCallback(async () => {
    if (!isAuthenticated) {
      setJourney(null);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get<GamificationJourney>('/gamification/me/journey');
      setJourney(response.data);
    } catch (error) {
      console.error('Não foi possível carregar a jornada:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshJourney();
  }, [refreshJourney]);

  const applyReward = useCallback((reward: GamificationReward, fallbackLabel = 'Missão concluída') => {
    if (reward.xpGained > 0) {
      const mainEvent = reward.events.find(event => event.sourceType !== 'DAILY_BONUS');
      setXpNotice({
        xpGained: reward.xpGained,
        description: translateRewardDescription(mainEvent?.description, fallbackLabel),
        achievementNames: reward.unlockedAchievements.map(achievement => achievement.name),
      });
      setXpNoticeOpen(true);
      void refreshJourney();
    }
  }, [refreshJourney]);

  const openStarCapsule = useCallback(async (capsuleId: number, selectedRewardType?: RewardType) => {
    const response = await api.post<StarCapsuleOpenResponse>(
      `/gamification/me/capsules/${capsuleId}/open`,
      selectedRewardType ? { selectedRewardType } : {},
    );
    if (response.data.reward.xpGained > 0) {
      setXpNotice({
        xpGained: response.data.reward.xpGained,
        description: 'Star Capsule aberta',
        achievementNames: response.data.reward.unlockedAchievements.map(achievement => achievement.name),
        specialReward: response.data.specialReward?.name,
      });
      setXpNoticeOpen(true);
    }
    await refreshJourney();
    return response.data;
  }, [refreshJourney]);

  const equipInventoryItem = useCallback(async (itemId: number) => {
    const response = await api.put<UserRewardItem>(`/gamification/me/inventory/${itemId}/equip`);
    setToast(`${response.data.name} equipped!`);
    await refreshJourney();
    return response.data;
  }, [refreshJourney]);

  const value = useMemo(() => ({ journey, loading, refreshJourney, applyReward, openStarCapsule, equipInventoryItem }),
    [journey, loading, refreshJourney, applyReward, openStarCapsule, equipInventoryItem]);

  return (
    <GamificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={xpNoticeOpen}
        autoHideDuration={5000}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') setXpNoticeOpen(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: { xs: 8, sm: 9 } }}
      >
        <Paper
          role="status"
          aria-live="polite"
          elevation={16}
          sx={{
            position: 'relative',
            width: 'min(420px, calc(100vw - 32px))',
            overflow: 'hidden',
            borderRadius: 4,
            border: `2px solid ${colors.xp}`,
            color: colors.text,
            background: `linear-gradient(135deg, ${colors.surfaceRaised} 0%, ${colors.nav} 100%)`,
            boxShadow: `0 18px 48px rgba(0, 0, 0, 0.42), 0 0 24px ${colors.xpSoft}`,
            animation: 'xp-notice-enter 420ms cubic-bezier(.2,.9,.25,1.15)',
            '@keyframes xp-notice-enter': {
              from: { opacity: 0, transform: 'translateY(-24px) scale(0.88)' },
              to: { opacity: 1, transform: 'translateY(0) scale(1)' },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `linear-gradient(110deg, transparent 25%, ${colors.xpSoft} 48%, transparent 70%)`,
              transform: 'translateX(-120%)',
              animation: 'xp-notice-shine 900ms 180ms ease-out',
            },
            '@keyframes xp-notice-shine': {
              to: { transform: 'translateX(120%)' },
            },
          }}
        >
          <IconButton
            aria-label="Fechar mensagem de XP"
            size="small"
            onClick={() => setXpNoticeOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, color: colors.textMuted }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2.5, pr: 5 }}>
            <Box
              sx={{
                width: 68,
                height: 68,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                color: colors.nav,
                bgcolor: colors.xp,
                boxShadow: `0 0 0 8px ${colors.xpSoft}`,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 36 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: colors.xp, fontWeight: 900, lineHeight: 1 }}>
                XP conquistado
              </Typography>
              <Typography sx={{ mt: 0.25, color: colors.xp, fontSize: { xs: '2rem', sm: '2.45rem' }, fontWeight: 950, lineHeight: 1 }}>
                +{xpNotice?.xpGained ?? 0} XP
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75, color: colors.text, fontWeight: 700 }}>
                {xpNotice?.description}
              </Typography>
            </Box>
          </Stack>

          {(xpNotice?.achievementNames.length || xpNotice?.specialReward) && (
            <Stack spacing={1} sx={{ px: 2.5, pb: 2.25 }}>
              {xpNotice?.achievementNames.map(name => (
                <Chip
                  key={name}
                  icon={<EmojiEventsIcon />}
                  label={`Nova conquista: ${name}`}
                  size="small"
                  sx={{ alignSelf: 'flex-start', bgcolor: colors.xpSoft, color: colors.xp, fontWeight: 800 }}
                />
              ))}
              {xpNotice?.specialReward && (
                <Typography variant="caption" sx={{ color: colors.textMuted, fontWeight: 700 }}>
                  Recompensa especial: {xpNotice.specialReward}
                </Typography>
              )}
            </Stack>
          )}
        </Paper>
      </Snackbar>
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast(null)} sx={{ fontWeight: 700 }}>
          {toast}
        </Alert>
      </Snackbar>
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
}
