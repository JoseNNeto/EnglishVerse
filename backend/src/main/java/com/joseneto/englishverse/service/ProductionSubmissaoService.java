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
    
    // Se quiser integrar com o progresso:
    @Autowired
    private ProgressoService progressoService;

    public ProductionSubmissao enviarSubmissao(ProductionSubmissao submissao) {
        // 1. Validar Aluno
        if (submissao.getAluno() == null || submissao.getAluno().getId() == null) {
            throw new RuntimeException("Quem é o aluno, boy?");
        }
        Usuario aluno = usuarioRepository.findById(submissao.getAluno().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        // 2. Validar Desafio
        if (submissao.getChallenge() == null || submissao.getChallenge().getId() == null) {
            throw new RuntimeException("Tá respondendo qual desafio?");
        }
        ProductionChallenge challenge = challengeRepository.findById(submissao.getChallenge().getId())
                .orElseThrow(() -> new RuntimeException("Desafio não encontrado!"));

        // 3. Salvar a submissão
        ProductionSubmissao salva = submissaoRepository.save(submissao);
        
        // 4. (Opcional/Smart) Atualizar o progresso para CONCLUIDO
        // Como Production é a última etapa, enviou = acabou a aula.
        progressoService.concluirModulo(aluno.getId(), challenge.getModulo().getId());

        return salva;
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
