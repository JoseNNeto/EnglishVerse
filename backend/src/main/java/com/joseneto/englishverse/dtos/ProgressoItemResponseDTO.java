package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.ProgressoItem;
import com.joseneto.englishverse.model.enums.ItemType;

public record ProgressoItemResponseDTO(
    Long id,
    Long alunoId,
    Long moduloId,
    Long itemId,
    ItemType itemType,
    LocalDateTime dataConclusao
) {
    public ProgressoItemResponseDTO(ProgressoItem progressoItem) {
        this(
            progressoItem.getId(),
            progressoItem.getAluno().getId(),
            progressoItem.getModulo().getId(),
            progressoItem.getItemId(),
            progressoItem.getItemType(),
            progressoItem.getDataConclusao()
        );
    }
}
