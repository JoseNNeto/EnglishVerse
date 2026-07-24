package com.joseneto.englishverse.model;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.enums.StarCapsuleStatus;
import com.joseneto.englishverse.model.enums.AchievementCategory;
import com.joseneto.englishverse.model.enums.RewardType;

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
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "category_star_capsules", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "category"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StarCapsule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Usuario user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AchievementCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StarCapsuleStatus status = StarCapsuleStatus.AVAILABLE;

    @Column(name = "reward_xp", nullable = false)
    private Integer rewardXp = 10;

    @Enumerated(EnumType.STRING)
    @Column(name = "special_reward_type", length = 40)
    private RewardType specialRewardType;

    @Column(name = "special_reward_code", length = 80)
    private String specialRewardCode;

    @Column(name = "earned_at", nullable = false)
    private LocalDateTime earnedAt;

    @Column(name = "opened_at")
    private LocalDateTime openedAt;
}
