package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joseneto.englishverse.model.Turma;

public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByDocenteIdOrderByPeriodoDescNomeAsc(Long docenteId);
    List<Turma> findByAlunosId(Long alunoId);
    boolean existsByDocenteIdAndAlunosId(Long docenteId, Long alunoId);
}
