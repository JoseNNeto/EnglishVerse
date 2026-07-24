package com.joseneto.englishverse.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.joseneto.englishverse.model.enums.GamificationLevel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_gamification_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserGamificationProfile {
    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "user_id")
    private Usuario user;

    @Column(name = "total_xp", nullable = false)
    private Integer totalXp = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_level", nullable = false)
    private GamificationLevel currentLevel = GamificationLevel.SPARK;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private Integer longestStreak = 0;

    @Column(name = "last_valid_activity_date")
    private LocalDate lastValidActivityDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}
