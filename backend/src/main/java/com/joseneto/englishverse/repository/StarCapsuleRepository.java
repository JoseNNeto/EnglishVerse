package com.joseneto.englishverse.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.joseneto.englishverse.model.StarCapsule;
import com.joseneto.englishverse.model.enums.AchievementCategory;

import jakarta.persistence.LockModeType;

public interface StarCapsuleRepository extends JpaRepository<StarCapsule, Long> {
    boolean existsByUserIdAndCategory(Long userId, AchievementCategory category);
    List<StarCapsule> findByUserIdOrderByEarnedAtDesc(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select capsule from StarCapsule capsule where capsule.id = :capsuleId and capsule.user.id = :userId")
    Optional<StarCapsule> findWithLockByIdAndUserId(
        @Param("capsuleId") Long capsuleId,
        @Param("userId") Long userId
    );
}
