package com.joseneto.englishverse.service;

import java.util.List;

import com.joseneto.englishverse.dtos.GamificationAchievementDTO;
import com.joseneto.englishverse.dtos.GamificationRewardDTO;
import com.joseneto.englishverse.dtos.XpTimelineEventDTO;
import com.joseneto.englishverse.model.Achievement;
import com.joseneto.englishverse.model.XpEvent;

public record GamificationAwardResult(List<XpEvent> events, List<Achievement> achievements) {
    public static GamificationAwardResult empty() {
        return new GamificationAwardResult(List.of(), List.of());
    }

    public GamificationRewardDTO toDto() {
        int gained = events.stream().mapToInt(XpEvent::getXpAmount).sum();
        return new GamificationRewardDTO(
            gained,
            events.stream().map(XpTimelineEventDTO::new).toList(),
            achievements.stream().map(a -> GamificationAchievementDTO.unlocked(a, null)).toList()
        );
    }
}
