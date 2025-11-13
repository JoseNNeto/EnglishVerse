package com.joseneto.englishverse.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joseneto.englishverse.model.Progresso;
import com.joseneto.englishverse.model.enums.StatusProgresso;

@Repository
public interface ProgressoRepository extends JpaRepository<Progresso, Long> {
    Optional<Progresso> findByAlunoIdAndModuloId(Long alunoId, Long moduloId);

    // Busca todos os módulos que o aluno tá fazendo (pro carrossel "Continuar Aprendendo")
    List<Progresso> findByAlunoIdAndStatus(Long alunoId, StatusProgresso status);

    // Busca todo o histórico do aluno
    List<Progresso> findByAlunoId(Long alunoId);
}
