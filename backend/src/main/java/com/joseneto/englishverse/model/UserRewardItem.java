package com.joseneto.englishverse.model;

import java.time.LocalDateTime;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_reward_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRewardItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Usuario user;

    @OneToOne(optional = false)
    @JoinColumn(name = "source_capsule_id", nullable = false, unique = true)
    private StarCapsule sourceCapsule;

    @Enumerated(EnumType.STRING)
    @Column(name = "reward_type", nullable = false, length = 40)
    private RewardType rewardType;

    @Column(name = "reward_code", nullable = false, length = 80)
    private String rewardCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 240)
    private String description;

    @Column(name = "asset_url", length = 240)
    private String assetUrl;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(nullable = false)
    private Boolean equipped = false;

    @Column(name = "unlocked_at", nullable = false)
    private LocalDateTime unlockedAt;
}
