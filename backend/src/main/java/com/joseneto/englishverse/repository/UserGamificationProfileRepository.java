package com.joseneto.englishverse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.joseneto.englishverse.model.UserGamificationProfile;

import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface UserGamificationProfileRepository extends JpaRepository<UserGamificationProfile, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select profile from UserGamificationProfile profile where profile.userId = :userId")
    Optional<UserGamificationProfile> findWithLockByUserId(@Param("userId") Long userId);
}
