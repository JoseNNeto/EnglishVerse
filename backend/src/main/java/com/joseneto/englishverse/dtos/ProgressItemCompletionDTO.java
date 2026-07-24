package com.joseneto.englishverse.dtos;

public record ProgressItemCompletionDTO(
    ProgressoItemResponseDTO progressItem,
    boolean newlyCompleted,
    GamificationRewardDTO reward
) {}
