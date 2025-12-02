package com.joseneto.englishverse.dtos;

import com.joseneto.englishverse.model.enums.ItemType;

public record ProgressoItemRequestDTO(
    Long moduloId,
    Long itemId,
    ItemType itemType
) {}
