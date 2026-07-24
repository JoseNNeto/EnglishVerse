package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.Achievement;
import com.joseneto.englishverse.model.enums.AchievementCategory;

public record GamificationAchievementDTO(
    Long id,
    String code,
    String name,
    String description,
    String iconKey,
    AchievementCategory category,
    boolean unlocked,
    LocalDateTime unlockedAt
) {
    public static GamificationAchievementDTO locked(Achievement achievement) {
        return from(achievement, false, null);
    }

    public static GamificationAchievementDTO unlocked(Achievement achievement, LocalDateTime unlockedAt) {
        return from(achievement, true, unlockedAt);
    }

    private static GamificationAchievementDTO from(
            Achievement achievement, boolean unlocked, LocalDateTime unlockedAt) {
        return new GamificationAchievementDTO(
            achievement.getId(), achievement.getCode(), achievement.getName(),
            achievement.getDescription(), achievement.getIconKey(), achievement.getCategory(),
            unlocked, unlockedAt
        );
    }
}
