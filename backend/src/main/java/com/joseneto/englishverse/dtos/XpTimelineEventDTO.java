package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.XpEvent;
import com.joseneto.englishverse.model.enums.XpEventType;
import com.joseneto.englishverse.model.enums.XpSourceType;

public record XpTimelineEventDTO(
    Long id,
    XpEventType type,
    XpSourceType sourceType,
    Long sourceId,
    Integer xpAmount,
    String description,
    LocalDateTime eventDateTime
) {
    public XpTimelineEventDTO(XpEvent event) {
        this(event.getId(), event.getType(), event.getSourceType(), event.getSourceId(),
            event.getXpAmount(), event.getDescription(), event.getEventDateTime());
    }
}
