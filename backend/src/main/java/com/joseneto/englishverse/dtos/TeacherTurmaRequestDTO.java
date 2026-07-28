package com.joseneto.englishverse.dtos;

import java.util.List;

import com.joseneto.englishverse.model.enums.IdiomaTurma;

public record TeacherTurmaRequestDTO(
    String nome,
    String periodo,
    IdiomaTurma idioma,
    List<String> alunosEmails
) {}
