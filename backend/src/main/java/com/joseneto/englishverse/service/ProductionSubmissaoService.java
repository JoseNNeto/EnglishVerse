package com.joseneto.englishverse.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.ProductionChallenge;
import com.joseneto.englishverse.model.ProductionSubmissao;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.repository.ProductionChallengeRepository;
import com.joseneto.englishverse.repository.ProductionSubmissaoRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class ProductionSubmissaoService {
    @Autowired
    private ProductionSubmissaoRepository submissaoRepository;
    @Autowired
    private ProductionChallengeRepository challengeRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public ProductionSubmissao enviarSubmissao(Long usuarioId, ProductionSubmissao submissao) {
        if (submissao.getResposta() == null || submissao.getResposta().isEmpty()) {
            throw new RuntimeException("A Production precisa de uma resposta válida.");
        }
        Usuario aluno = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        // 2. Validar Desafio
        if (submissao.getChallenge() == null || submissao.getChallenge().getId() == null) {
            throw new RuntimeException("Tá respondendo qual desafio?");
        }
        ProductionChallenge challenge = challengeRepository.findById(submissao.getChallenge().getId())
                .orElseThrow(() -> new RuntimeException("Desafio não encontrado!"));

        // Keep every submission as an attempt. The gamification layer rewards
        // only the first replay, while later attempts remain available as
        // learning history without granting more XP.
        submissao.setAluno(aluno);
        submissao.setChallenge(challenge);
        return submissaoRepository.save(submissao);
    }

    // Método pro Professor usar
    public ProductionSubmissao registrarFeedback(Long id, String feedback) {
        return submissaoRepository.findById(id)
            .map(submissao -> {
                submissao.setFeedbackProfessor(feedback);
                return submissaoRepository.save(submissao);
            }).orElseThrow(() -> new RuntimeException("Submissão não encontrada!"));
    }

    public List<ProductionSubmissao> listarPorAluno(Long alunoId) {
        return submissaoRepository.findByAlunoId(alunoId);
    }
    
    public List<ProductionSubmissao> listarPorDesafio(Long challengeId) {
        return submissaoRepository.findByChallengeId(challengeId);
    }
}
