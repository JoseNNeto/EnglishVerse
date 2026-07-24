package com.joseneto.englishverse.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.joseneto.englishverse.model.UserRewardItem;
import com.joseneto.englishverse.model.enums.RewardType;

import jakarta.persistence.LockModeType;

public interface UserRewardItemRepository extends JpaRepository<UserRewardItem, Long> {
    List<UserRewardItem> findByUserIdOrderByUnlockedAtDesc(Long userId);
    Optional<UserRewardItem> findBySourceCapsuleId(Long capsuleId);
    Optional<UserRewardItem> findFirstByUserIdAndRewardTypeAndQuantityGreaterThanOrderByUnlockedAtAsc(
        Long userId, RewardType rewardType, Integer quantity);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select item from UserRewardItem item where item.id = :itemId and item.user.id = :userId")
    Optional<UserRewardItem> findWithLockByIdAndUserId(
        @Param("itemId") Long itemId,
        @Param("userId") Long userId
    );

    List<UserRewardItem> findByUserIdAndRewardType(Long userId, RewardType rewardType);
}
