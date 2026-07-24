package com.joseneto.englishverse.dtos;

import com.joseneto.englishverse.model.enums.RewardType;

public record StarCapsuleOpenRequestDTO(
    RewardType selectedRewardType
) {}
