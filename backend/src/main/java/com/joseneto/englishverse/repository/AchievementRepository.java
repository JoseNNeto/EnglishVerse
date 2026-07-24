package com.joseneto.englishverse.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joseneto.englishverse.model.Achievement;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    Optional<Achievement> findByCode(String code);
    List<Achievement> findAllByOrderByCategoryAscNameAsc();
}
