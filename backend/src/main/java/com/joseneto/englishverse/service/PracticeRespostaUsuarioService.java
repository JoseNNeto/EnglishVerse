package com.joseneto.englishverse.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.PracticeAtividade;
import com.joseneto.englishverse.model.PracticeRespostaUsuario;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;
import com.joseneto.englishverse.repository.PracticeRespostaUsuarioRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class PracticeRespostaUsuarioService {
    @Autowired
    private PracticeRespostaUsuarioRepository respostaRepository;
    @Autowired
    private PracticeAtividadeRepository atividadeRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public PracticeRespostaUsuario registrarResposta(PracticeRespostaUsuario respostaUsuario) {
        // 1. Validar Aluno
        if (respostaUsuario.getAluno() == null || respostaUsuario.getAluno().getId() == null) {
            throw new RuntimeException("Quem tá respondendo, boy?");
        }
        Usuario aluno = usuarioRepository.findById(respostaUsuario.getAluno().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        // 2. Validar Atividade
        if (respostaUsuario.getAtividade() == null || respostaUsuario.getAtividade().getId() == null) {
            throw new RuntimeException("Respondendo qual atividade?");
        }
        PracticeAtividade atividade = atividadeRepository.findById(respostaUsuario.getAtividade().getId())
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada!"));

        // Aqui o sistema salva o histórico. 
        // Se o aluno tentar 10 vezes, salva 10 linhas. Isso é bom pra análise de dados depois.
        return respostaRepository.save(respostaUsuario);
    }

    public List<PracticeRespostaUsuario> listarPorAluno(Long alunoId) {
        return respostaRepository.findByAlunoId(alunoId);
    }
}
