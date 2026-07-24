package com.joseneto.englishverse.dtos;

import com.joseneto.englishverse.model.enums.ItemType;

public record ProgressoItemRequestDTO(
    Long moduloId,
    Long itemId,
    ItemType itemType,
    Boolean replay
) {
    public boolean replayRequested() {
        return Boolean.TRUE.equals(replay);
    }
}
