package com.joseneto.englishverse.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.joseneto.englishverse.dtos.GamificationRewardDTO;
import com.joseneto.englishverse.dtos.ProgressItemCompletionDTO;
import com.joseneto.englishverse.dtos.ProgressoItemResponseDTO;
import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.model.PracticeAtividade;
import com.joseneto.englishverse.model.ProgressoItem;
import com.joseneto.englishverse.model.ProductionChallenge;
import com.joseneto.englishverse.model.RecursoApresentacao;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.model.enums.ItemType;
import com.joseneto.englishverse.model.enums.StatusCorrecao;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;
import com.joseneto.englishverse.repository.PracticeRespostaUsuarioRepository;
import com.joseneto.englishverse.repository.ProgressoItemRepository;
import com.joseneto.englishverse.repository.ProductionChallengeRepository;
import com.joseneto.englishverse.repository.ProductionSubmissaoRepository;
import com.joseneto.englishverse.repository.RecursoApresentacaoRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class ProgressoItemService {
    private final ProgressoItemRepository progressoItemRepository;
    private final UsuarioRepository usuarioRepository;
    private final ModuloRepository moduloRepository;
    private final RecursoApresentacaoRepository recursoRepository;
    private final PracticeAtividadeRepository practiceRepository;
    private final PracticeRespostaUsuarioRepository practiceRespostaRepository;
    private final ProductionChallengeRepository productionRepository;
    private final ProductionSubmissaoRepository productionSubmissaoRepository;
    private final GamificationService gamificationService;

    public ProgressoItemService(
            ProgressoItemRepository progressoItemRepository,
            UsuarioRepository usuarioRepository,
            ModuloRepository moduloRepository,
            RecursoApresentacaoRepository recursoRepository,
            PracticeAtividadeRepository practiceRepository,
            PracticeRespostaUsuarioRepository practiceRespostaRepository,
            ProductionChallengeRepository productionRepository,
            ProductionSubmissaoRepository productionSubmissaoRepository,
            GamificationService gamificationService) {
        this.progressoItemRepository = progressoItemRepository;
        this.usuarioRepository = usuarioRepository;
        this.moduloRepository = moduloRepository;
        this.recursoRepository = recursoRepository;
        this.practiceRepository = practiceRepository;
        this.practiceRespostaRepository = practiceRespostaRepository;
        this.productionRepository = productionRepository;
        this.productionSubmissaoRepository = productionSubmissaoRepository;
        this.gamificationService = gamificationService;
    }

    public List<ProgressoItem> getProgressoPorModulo(Long usuarioId, Long moduloId) {
        return progressoItemRepository.findByAlunoIdAndModuloId(usuarioId, moduloId);
    }

    @Transactional
    public ProgressItemCompletionDTO marcarComoConcluido(
            Long usuarioId, Long moduloId, Long itemId, ItemType itemType, boolean replayRequested) {
        Optional<ProgressoItem> existing = progressoItemRepository
            .findByAlunoIdAndModuloIdAndItemIdAndItemType(usuarioId, moduloId, itemId, itemType);
        if (existing.isPresent()) {
            if (!replayRequested || !repeticaoFoiPersistida(usuarioId, itemId, itemType)) {
                return new ProgressItemCompletionDTO(
                    new ProgressoItemResponseDTO(existing.get()), false, GamificationRewardDTO.empty());
            }
            Usuario aluno = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Aluno nÃ£o encontrado"));
            Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new RuntimeException("MÃ³dulo nÃ£o encontrado"));
            GamificationAwardResult replayReward = gamificationService.processRepeatedItemCompletion(
                aluno, modulo, itemId, itemType);
            return new ProgressItemCompletionDTO(
                new ProgressoItemResponseDTO(existing.get()), false, replayReward.toDto());
        }

        Usuario aluno = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Modulo modulo = moduloRepository.findById(moduloId)
            .orElseThrow(() -> new RuntimeException("Módulo não encontrado"));
        validarConclusaoPersistida(usuarioId, moduloId, itemId, itemType);

        ProgressoItem novo = new ProgressoItem();
        novo.setAluno(aluno);
        novo.setModulo(modulo);
        novo.setItemId(itemId);
        novo.setItemType(itemType);
        novo.setDataConclusao(LocalDateTime.now());
        ProgressoItem salvo = progressoItemRepository.save(novo);

        GamificationAwardResult reward = gamificationService.processNewItemCompletion(
            aluno, modulo, itemId, itemType);
        return new ProgressItemCompletionDTO(
            new ProgressoItemResponseDTO(salvo), true, reward.toDto());
    }

    private boolean repeticaoFoiPersistida(Long usuarioId, Long itemId, ItemType itemType) {
        return switch (itemType) {
            case PRESENTATION -> true;
            case PRACTICE -> practiceRespostaRepository
                .countByAlunoIdAndAtividadeIdAndEstaCorretaTrue(usuarioId, itemId) >= 2;
            case PRODUCTION -> productionSubmissaoRepository
                .countByAlunoIdAndChallengeIdAndStatusCorrecao(
                    usuarioId, itemId, StatusCorrecao.APROVADA) >= 2;
        };
    }

    private void validarConclusaoPersistida(Long usuarioId, Long moduloId, Long itemId, ItemType itemType) {
        switch (itemType) {
            case PRESENTATION -> {
                RecursoApresentacao recurso = recursoRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Presentation não encontrada"));
                validarModulo(moduloId, recurso.getModulo().getId());
            }
            case PRACTICE -> {
                PracticeAtividade practice = practiceRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Practice não encontrada"));
                validarModulo(moduloId, practice.getModulo().getId());
                if (!practiceRespostaRepository.existsByAlunoIdAndAtividadeIdAndEstaCorretaTrue(usuarioId, itemId)) {
                    throw new RuntimeException("A Practice precisa de uma resposta correta persistida");
                }
            }
            case PRODUCTION -> {
                ProductionChallenge production = productionRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Production não encontrada"));
                validarModulo(moduloId, production.getModulo().getId());
                if (!productionSubmissaoRepository.existsByAlunoIdAndChallengeIdAndStatusCorrecao(
                        usuarioId, itemId, StatusCorrecao.APROVADA)) {
                    throw new RuntimeException("A Production precisa da aprovação do professor");
                }
            }
        }
    }

    private void validarModulo(Long moduloInformado, Long moduloDoItem) {
        if (!moduloInformado.equals(moduloDoItem)) {
            throw new RuntimeException("O item não pertence ao módulo informado");
        }
    }
}
