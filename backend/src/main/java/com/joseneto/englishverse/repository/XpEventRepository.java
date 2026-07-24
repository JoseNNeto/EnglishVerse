package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joseneto.englishverse.model.XpEvent;

public interface XpEventRepository extends JpaRepository<XpEvent, Long> {
    boolean existsByUniqueKey(String uniqueKey);
    List<XpEvent> findTop30ByUserIdOrderByEventDateTimeDesc(Long userId);
}
