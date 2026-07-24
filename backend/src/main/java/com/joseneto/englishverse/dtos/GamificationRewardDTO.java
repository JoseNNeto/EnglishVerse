package com.joseneto.englishverse.dtos;

import java.util.List;

public record GamificationRewardDTO(
    int xpGained,
    List<XpTimelineEventDTO> events,
    List<GamificationAchievementDTO> unlockedAchievements
) {
    public static GamificationRewardDTO empty() {
        return new GamificationRewardDTO(0, List.of(), List.of());
    }
}
