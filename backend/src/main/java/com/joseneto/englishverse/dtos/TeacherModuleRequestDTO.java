package com.joseneto.englishverse.dtos;

import com.joseneto.englishverse.model.enums.NivelDificuldade;

public record TeacherModuleRequestDTO(
    Long turmaId,
    String titulo,
    String descricao,
    String imagemCapaUrl,
    NivelDificuldade nivel,
    Boolean publicado
) {}
