package com.joseneto.englishverse.dtos;

public record NextMissionDTO(
    Long moduleId,
    String title,
    long completedItems,
    long totalItems,
    int remainingXp
) {}
