package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joseneto.englishverse.model.PracticeAtividade;

@Repository
public interface PracticeAtividadeRepository extends JpaRepository<PracticeAtividade, Long> {
    List<PracticeAtividade> findByModuloId(Long moduloId);
}
