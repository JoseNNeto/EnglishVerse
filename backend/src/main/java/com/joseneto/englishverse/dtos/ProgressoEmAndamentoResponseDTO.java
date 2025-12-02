package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.Progresso;
import com.joseneto.englishverse.model.enums.StatusProgresso;

public record ProgressoEmAndamentoResponseDTO(
    Long id,
    Long alunoId,
    Long moduloId,
    String moduloTitulo,
    String moduloImagemCapaUrl,
    StatusProgresso status,
    LocalDateTime dataInicio,
    LocalDateTime dataConclusao,
    long totalItens, // Changed from int to long
    long itensConcluidos // Changed from int to long
) {
    public ProgressoEmAndamentoResponseDTO(Progresso progresso, long totalItens, long itensConcluidos) { // Changed from int to long
        this(
            progresso.getId(),
            progresso.getAluno().getId(),
            progresso.getModulo().getId(),
            progresso.getModulo().getTitulo(),
            progresso.getModulo().getImagemCapaUrl(),
            progresso.getStatus(),
            progresso.getDataInicio(),
            progresso.getDataConclusao(),
            totalItens,
            itensConcluidos
        );
    }
}
