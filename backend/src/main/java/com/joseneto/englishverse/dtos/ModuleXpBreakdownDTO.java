package com.joseneto.englishverse.dtos;

public record ModuleXpBreakdownDTO(
    int presentationXp,
    int practiceXp,
    int productionXp,
    int practiceStageBonusXp,
    int moduleBonusXp,
    int totalXp
) {}
