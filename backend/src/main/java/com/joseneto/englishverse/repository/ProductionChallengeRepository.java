package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joseneto.englishverse.model.ProductionChallenge;

@Repository
public interface ProductionChallengeRepository extends JpaRepository<ProductionChallenge, Long> {
    List<ProductionChallenge> findByModuloId(Long moduloId);
    long countByModuloId(Long moduloId);
}
