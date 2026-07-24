package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.StarCapsule;
import com.joseneto.englishverse.model.enums.StarCapsuleStatus;
import com.joseneto.englishverse.model.enums.RewardType;

public record StarCapsuleDTO(
    Long id,
    StarCapsuleStatus status,
    Integer rewardXp,
    RewardType specialRewardType,
    String earnedFrom,
    LocalDateTime earnedAt,
    LocalDateTime openedAt
) {
    public StarCapsuleDTO(StarCapsule capsule) {
        this(
            capsule.getId(),
            capsule.getStatus(),
            capsule.getRewardXp(),
            capsule.getCategory() == com.joseneto.englishverse.model.enums.AchievementCategory.POP_CULTURE
                ? null
                : capsule.getSpecialRewardType(),
            categoryLabel(capsule.getCategory()),
            capsule.getEarnedAt(),
            capsule.getOpenedAt()
        );
    }

    private static String categoryLabel(com.joseneto.englishverse.model.enums.AchievementCategory category) {
        return switch (category) {
            case CONSISTENCY -> "Consistency";
            case CONTENT_MASTERY -> "Content Mastery";
            case POP_CULTURE -> "Pop Culture";
        };
    }
}
