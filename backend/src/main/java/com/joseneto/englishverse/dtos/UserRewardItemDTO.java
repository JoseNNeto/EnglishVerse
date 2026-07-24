package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.UserRewardItem;
import com.joseneto.englishverse.model.enums.RewardType;

public record UserRewardItemDTO(
    Long id,
    RewardType rewardType,
    String rewardCode,
    String name,
    String description,
    String assetUrl,
    Integer quantity,
    Boolean equipped,
    LocalDateTime unlockedAt
) {
    public UserRewardItemDTO(UserRewardItem item) {
        this(
            item.getId(), item.getRewardType(), item.getRewardCode(), item.getName(),
            item.getDescription(), item.getAssetUrl(), item.getQuantity(), item.getEquipped(),
            item.getUnlockedAt()
        );
    }
}
