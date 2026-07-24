package com.joseneto.englishverse.dtos;

import java.util.List;

public record GamificationJourneyDTO(
    GamificationSummaryDTO summary,
    NextMissionDTO nextMission,
    List<ModuleJourneyDTO> modules,
    List<GamificationAchievementDTO> achievements,
    List<XpTimelineEventDTO> timeline,
    List<StarCapsuleDTO> starCapsules,
    List<UserRewardItemDTO> inventory
) {}
