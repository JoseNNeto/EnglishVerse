export interface GamificationSummary {
  totalXp: number;
  levelCode: string;
  levelName: string;
  levelEnglishName: string;
  levelMinimumXp: number;
  nextLevelXp: number | null;
  nextLevelName: string | null;
  xpToNextLevel: number;
  progressPercent: number;
  currentStreak: number;
  longestStreak: number;
  lastValidActivityDate: string | null;
  modulesCompleted: number;
  totalPublishedModules: number;
  unlockedAchievements: number;
}

export interface GamificationAchievement {
  id: number;
  code: string;
  name: string;
  description: string;
  iconKey: string;
  category: 'CONSISTENCY' | 'CONTENT_MASTERY' | 'POP_CULTURE';
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface XpTimelineEvent {
  id: number;
  type: string;
  sourceType: string;
  sourceId: number | null;
  xpAmount: number;
  description: string;
  eventDateTime: string;
}

export interface ModuleJourney {
  moduleId: number;
  title: string;
  totalItems: number;
  completedItems: number;
  maximumXp: number;
  remainingXp: number;
  status: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
}

export interface NextMission {
  moduleId: number;
  title: string;
  completedItems: number;
  totalItems: number;
  remainingXp: number;
}

export interface GamificationJourney {
  summary: GamificationSummary;
  nextMission: NextMission | null;
  modules: ModuleJourney[];
  achievements: GamificationAchievement[];
  timeline: XpTimelineEvent[];
  starCapsules: StarCapsule[];
  inventory: UserRewardItem[];
}

export type RewardType = 'ORBITAL_SHIELD' | 'PROFILE_TITLE' | 'AVATAR_FRAME';

export interface StarCapsule {
  id: number;
  status: 'AVAILABLE' | 'OPENED';
  rewardXp: number;
  specialRewardType: RewardType | null;
  earnedFrom: string;
  earnedAt: string;
  openedAt: string | null;
}

export interface StarCapsuleOpenResponse {
  capsule: StarCapsule;
  reward: GamificationReward;
  specialReward: UserRewardItem | null;
}

export interface UserRewardItem {
  id: number;
  rewardType: RewardType;
  rewardCode: string;
  name: string;
  description: string;
  assetUrl: string | null;
  quantity: number;
  equipped: boolean;
  unlockedAt: string;
}

export interface GamificationReward {
  xpGained: number;
  events: XpTimelineEvent[];
  unlockedAchievements: GamificationAchievement[];
}

export interface ProgressItemCompletionResponse {
  progressItem: {
    id: number;
    alunoId: number;
    moduloId: number;
    itemId: number;
    itemType: 'PRESENTATION' | 'PRACTICE' | 'PRODUCTION';
    dataConclusao: string;
  };
  newlyCompleted: boolean;
  reward: GamificationReward;
}

export interface ModuleCompletionResponse {
  moduleId: number;
  moduleTitle: string;
  status: string;
  completedAt: string;
  newlyCompleted: boolean;
  breakdown: {
    presentationXp: number;
    practiceXp: number;
    productionXp: number;
    practiceStageBonusXp: number;
    moduleBonusXp: number;
    totalXp: number;
  };
  reward: GamificationReward;
}
