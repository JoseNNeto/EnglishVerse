package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joseneto.englishverse.model.RecursoApresentacao;

@Repository
public interface RecursoApresentacaoRepository extends JpaRepository<RecursoApresentacao, Long> {
    List<RecursoApresentacao> findByModuloIdOrderByOrdemAsc(Long moduloId);
}
