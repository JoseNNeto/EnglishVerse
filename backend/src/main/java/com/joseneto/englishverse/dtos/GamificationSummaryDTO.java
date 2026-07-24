package com.joseneto.englishverse.dtos;

import java.time.LocalDate;

public record GamificationSummaryDTO(
    Integer totalXp,
    String levelCode,
    String levelName,
    String levelEnglishName,
    Integer levelMinimumXp,
    Integer nextLevelXp,
    String nextLevelName,
    Integer xpToNextLevel,
    Integer progressPercent,
    Integer currentStreak,
    Integer longestStreak,
    LocalDate lastValidActivityDate,
    long modulesCompleted,
    long totalPublishedModules,
    long unlockedAchievements
) {}
