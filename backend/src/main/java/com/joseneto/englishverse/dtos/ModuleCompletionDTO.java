package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.enums.StatusProgresso;

public record ModuleCompletionDTO(
    Long moduleId,
    String moduleTitle,
    StatusProgresso status,
    LocalDateTime completedAt,
    boolean newlyCompleted,
    ModuleXpBreakdownDTO breakdown,
    GamificationRewardDTO reward
) {}
