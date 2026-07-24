import { Alert, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
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

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [journey, setJourney] = useState<GamificationJourney | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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
      setToast(`+${reward.xpGained} XP — ${mainEvent?.description || fallbackLabel}!`);
      void refreshJourney();
    }
  }, [refreshJourney]);

  const openStarCapsule = useCallback(async (capsuleId: number, selectedRewardType?: RewardType) => {
    const response = await api.post<StarCapsuleOpenResponse>(
      `/gamification/me/capsules/${capsuleId}/open`,
      selectedRewardType ? { selectedRewardType } : {},
    );
    if (response.data.reward.xpGained > 0) {
      const specialReward = response.data.specialReward ? ` + ${response.data.specialReward.name}` : '';
      setToast(`+${response.data.reward.xpGained} XP${specialReward}!`);
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
