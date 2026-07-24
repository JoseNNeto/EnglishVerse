package com.joseneto.englishverse.model;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.enums.XpEventType;
import com.joseneto.englishverse.model.enums.XpSourceType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "xp_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class XpEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Usuario user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private XpEventType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false)
    private XpSourceType sourceType;

    @Column(name = "source_id")
    private Long sourceId;

    @Column(name = "xp_amount", nullable = false)
    private Integer xpAmount;

    @Column(nullable = false, length = 180)
    private String description;

    @Column(name = "event_date_time", nullable = false)
    private LocalDateTime eventDateTime;

    @Column(name = "unique_key", nullable = false, unique = true, length = 180)
    private String uniqueKey;
}
