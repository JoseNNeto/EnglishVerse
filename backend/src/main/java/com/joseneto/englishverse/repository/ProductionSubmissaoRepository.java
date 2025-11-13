package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joseneto.englishverse.model.ProductionSubmissao;

@Repository
public interface ProductionSubmissaoRepository extends JpaRepository<ProductionSubmissao, Long> {
    List<ProductionSubmissao> findByAlunoId(Long alunoId);

    // Busca todas as respostas de um desafio específico (pra tela de correção do professor)
    List<ProductionSubmissao> findByChallengeId(Long challengeId);
    
    // Busca se o aluno já respondeu esse desafio específico
    boolean existsByAlunoIdAndChallengeId(Long alunoId, Long challengeId);
}
