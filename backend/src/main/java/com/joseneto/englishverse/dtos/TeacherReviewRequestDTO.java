package com.joseneto.englishverse.dtos;

import com.joseneto.englishverse.model.enums.StatusCorrecao;

public record TeacherReviewRequestDTO(
    StatusCorrecao status,
    String feedback,
    Integer nota
) {}
