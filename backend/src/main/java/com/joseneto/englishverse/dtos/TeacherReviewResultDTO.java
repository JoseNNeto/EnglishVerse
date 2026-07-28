package com.joseneto.englishverse.dtos;

public record TeacherReviewResultDTO(
    Long submissaoId,
    String status,
    boolean xpLiberado,
    int xp
) {}
