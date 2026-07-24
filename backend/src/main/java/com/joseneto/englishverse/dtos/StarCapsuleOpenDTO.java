package com.joseneto.englishverse.dtos;

public record StarCapsuleOpenDTO(
    StarCapsuleDTO capsule,
    GamificationRewardDTO reward,
    UserRewardItemDTO specialReward
) {}
