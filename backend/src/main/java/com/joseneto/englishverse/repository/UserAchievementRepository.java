package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joseneto.englishverse.model.UserAchievement;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    boolean existsByUserIdAndAchievementId(Long userId, Long achievementId);
    List<UserAchievement> findByUserIdOrderByUnlockedAtDesc(Long userId);
    long countByUserId(Long userId);
}
