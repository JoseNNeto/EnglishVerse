package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joseneto.englishverse.model.PracticeRespostaUsuario;

@Repository
public interface PracticeRespostaUsuarioRepository extends JpaRepository<PracticeRespostaUsuario, Long> {
    List<PracticeRespostaUsuario> findByAlunoId(Long alunoId);

    // Busca as respostas de um aluno para uma atividade específica (pra saber se ele já acertou antes)
    List<PracticeRespostaUsuario> findByAlunoIdAndAtividadeId(Long alunoId, Long atividadeId);
}
