package com.joseneto.englishverse.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.dtos.ProgressoEmAndamentoResponseDTO;
import com.joseneto.englishverse.dtos.ModuleCompletionDTO;
import com.joseneto.englishverse.dtos.ModuleXpBreakdownDTO;
import com.joseneto.englishverse.dtos.GamificationRewardDTO;
import com.joseneto.englishverse.dtos.UltimoAcessoDTO;
import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.model.Progresso;
import com.joseneto.englishverse.model.ProgressoItem;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.model.enums.StatusProgresso;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;
import com.joseneto.englishverse.repository.ProductionChallengeRepository;
import com.joseneto.englishverse.repository.ProgressoItemRepository;
import com.joseneto.englishverse.repository.ProgressoRepository;
import com.joseneto.englishverse.repository.RecursoApresentacaoRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class ProgressoService {
    @Autowired
    private ProgressoRepository progressoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ModuloRepository moduloRepository;
    @Autowired
    private RecursoApresentacaoRepository recursoApresentacaoRepository;
    @Autowired
    private PracticeAtividadeRepository practiceAtividadeRepository;
    @Autowired
    private ProductionChallengeRepository productionChallengeRepository;
    @Autowired
    private ProgressoItemRepository progressoItemRepository;
    @Autowired
    private GamificationService gamificationService;


    // Quando o aluno clica em "Começar Módulo"
    public Progresso iniciarModulo(Long alunoId, Long moduloId) {
        // Verifica se já existe um registro pra não duplicar
        Optional<Progresso> existente = progressoRepository.findByAlunoIdAndModuloId(alunoId, moduloId);
        if (existente.isPresent()) {
            return existente.get(); // Se já começou, só retorna o que tem
        }

        Usuario aluno = usuarioRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));
        Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new RuntimeException("Módulo não encontrado!"));

        Progresso novo = new Progresso();
        novo.setAluno(aluno);
        novo.setModulo(modulo);
        novo.setStatus(StatusProgresso.EM_ANDAMENTO);
        novo.setDataInicio(LocalDateTime.now());

        return progressoRepository.save(novo);
    }

    // Quando o aluno termina tudo (chamado no final da etapa Production)
    public ModuleCompletionDTO concluirModulo(Usuario aluno, Long moduloId) {
        Progresso progresso = progressoRepository.findByAlunoIdAndModuloId(aluno.getId(), moduloId)
                .orElseThrow(() -> new RuntimeException("Oxe, o aluno nem começou esse módulo ainda!"));

        long totalRecursos = recursoApresentacaoRepository.countByModuloId(moduloId);
        long totalPraticas = practiceAtividadeRepository.countByModuloId(moduloId);
        long totalProducoes = productionChallengeRepository.countByModuloId(moduloId);
        long totalItens = totalRecursos + totalPraticas + totalProducoes;
        long itensConcluidos = progressoItemRepository.countByAlunoIdAndModuloId(aluno.getId(), moduloId);
        if (totalItens == 0 || itensConcluidos < totalItens) {
            throw new RuntimeException("Conclua todos os itens PPP antes de finalizar o módulo.");
        }

        ModuleXpBreakdownDTO breakdown = criarBreakdown(
            totalRecursos, totalPraticas, totalProducoes, totalPraticas > 0, true);
        if (progresso.getStatus() == StatusProgresso.CONCLUIDO) {
            return new ModuleCompletionDTO(
                moduloId, progresso.getModulo().getTitulo(), progresso.getStatus(),
                progresso.getDataConclusao(), false, breakdown, GamificationRewardDTO.empty());
        }

        progresso.setStatus(StatusProgresso.CONCLUIDO);
        progresso.setDataConclusao(LocalDateTime.now());
        Progresso salvo = progressoRepository.save(progresso);
        GamificationAwardResult reward = gamificationService.processModuleCompletion(aluno, salvo.getModulo());
        return new ModuleCompletionDTO(
            moduloId, salvo.getModulo().getTitulo(), salvo.getStatus(), salvo.getDataConclusao(),
            true, breakdown, reward.toDto());
    }

    private ModuleXpBreakdownDTO criarBreakdown(
            long presentations, long practices, long productions,
            boolean practiceStageComplete, boolean moduleComplete) {
        int presentationXp = Math.toIntExact(presentations * GamificationService.PRESENTATION_XP);
        int practiceXp = Math.toIntExact(practices * GamificationService.PRACTICE_XP);
        int productionXp = Math.toIntExact(productions * GamificationService.PRODUCTION_XP);
        int practiceBonus = practiceStageComplete ? GamificationService.PRACTICE_STAGE_XP : 0;
        int moduleBonus = moduleComplete ? GamificationService.MODULE_XP : 0;
        return new ModuleXpBreakdownDTO(
            presentationXp, practiceXp, productionXp, practiceBonus, moduleBonus,
            presentationXp + practiceXp + productionXp + practiceBonus + moduleBonus);
    }

    public List<ProgressoEmAndamentoResponseDTO> listarEmAndamento(Long alunoId) {
        List<Progresso> progressos = progressoRepository.findByAlunoIdAndStatus(alunoId, StatusProgresso.EM_ANDAMENTO);

        return progressos.stream().map(progresso -> {
            Long moduloId = progresso.getModulo().getId();
            
            long totalRecursos = recursoApresentacaoRepository.countByModuloId(moduloId);
            long totalPraticas = practiceAtividadeRepository.countByModuloId(moduloId);
            long totalProducoes = productionChallengeRepository.countByModuloId(moduloId);
            long totalItens = totalRecursos + totalPraticas + totalProducoes;

            long itensConcluidos = progressoItemRepository.countByAlunoIdAndModuloId(alunoId, moduloId);

            return new ProgressoEmAndamentoResponseDTO(progresso, totalItens, itensConcluidos);
        }).collect(Collectors.toList());
    }

    public Optional<UltimoAcessoDTO> getUltimoAcesso(Long alunoId, Long moduloId) {
        List<ProgressoItem> itensConcluidos = progressoItemRepository.findByAlunoIdAndModuloId(alunoId, moduloId);

        if (itensConcluidos.isEmpty()) {
            return Optional.empty();
        }

        // Encontra o item com a data de conclusão mais recente
        ProgressoItem ultimoItem = itensConcluidos.stream()
                .max(Comparator.comparing(ProgressoItem::getDataConclusao))
                .get();

        return Optional.of(new UltimoAcessoDTO(
                ultimoItem.getItemType().name(),
                ultimoItem.getItemId(),
                ultimoItem.getModulo().getId()
        ));
    }
}
