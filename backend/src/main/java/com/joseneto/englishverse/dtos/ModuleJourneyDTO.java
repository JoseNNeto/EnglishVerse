package com.joseneto.englishverse.dtos;

public record ModuleJourneyDTO(
    Long moduleId,
    String title,
    long totalItems,
    long completedItems,
    int maximumXp,
    int remainingXp,
    String status
) {}
