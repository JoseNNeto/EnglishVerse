package com.joseneto.englishverse.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.joseneto.englishverse.dtos.ProgressItemCompletionDTO;
import com.joseneto.englishverse.dtos.TeacherContentRequestDTO;
import com.joseneto.englishverse.dtos.TeacherModuleRequestDTO;
import com.joseneto.englishverse.dtos.TeacherReviewRequestDTO;
import com.joseneto.englishverse.dtos.TeacherReviewResultDTO;
import com.joseneto.englishverse.dtos.TeacherStudioDashboardDTO;
import com.joseneto.englishverse.dtos.TeacherTurmaRequestDTO;
import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.model.PracticeAtividade;
import com.joseneto.englishverse.model.ProductionChallenge;
import com.joseneto.englishverse.model.ProductionSubmissao;
import com.joseneto.englishverse.model.RecursoApresentacao;
import com.joseneto.englishverse.model.Topico;
import com.joseneto.englishverse.model.Turma;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.model.enums.ItemType;
import com.joseneto.englishverse.model.enums.EtapaConteudo;
import com.joseneto.englishverse.model.enums.NivelDificuldade;
import com.joseneto.englishverse.model.enums.StatusCorrecao;
import com.joseneto.englishverse.model.enums.TipoAtividade;
import com.joseneto.englishverse.model.enums.TipoDesafio;
import com.joseneto.englishverse.model.enums.TipoPerfil;
import com.joseneto.englishverse.model.enums.TipoRecurso;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;
import com.joseneto.englishverse.repository.PracticeRespostaUsuarioRepository;
import com.joseneto.englishverse.repository.ProductionChallengeRepository;
import com.joseneto.englishverse.repository.ProductionSubmissaoRepository;
import com.joseneto.englishverse.repository.ProgressoItemRepository;
import com.joseneto.englishverse.repository.ProgressoRepository;
import com.joseneto.englishverse.repository.RecursoApresentacaoRepository;
import com.joseneto.englishverse.repository.TopicoRepository;
import com.joseneto.englishverse.repository.TurmaRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class TeacherStudioService {
    private final TurmaRepository turmaRepository;
    private final ModuloRepository moduloRepository;
    private final TopicoRepository topicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RecursoApresentacaoRepository recursoRepository;
    private final PracticeAtividadeRepository practiceRepository;
    private final PracticeRespostaUsuarioRepository practiceRespostaRepository;
    private final ProductionChallengeRepository productionRepository;
    private final ProductionSubmissaoRepository submissaoRepository;
    private final ProgressoItemRepository progressoItemRepository;
    private final ProgressoRepository progressoRepository;
    private final ProgressoItemService progressoItemService;

    public TeacherStudioService(
            TurmaRepository turmaRepository,
            ModuloRepository moduloRepository,
            TopicoRepository topicoRepository,
            UsuarioRepository usuarioRepository,
            RecursoApresentacaoRepository recursoRepository,
            PracticeAtividadeRepository practiceRepository,
            PracticeRespostaUsuarioRepository practiceRespostaRepository,
            ProductionChallengeRepository productionRepository,
            ProductionSubmissaoRepository submissaoRepository,
            ProgressoItemRepository progressoItemRepository,
            ProgressoRepository progressoRepository,
            ProgressoItemService progressoItemService) {
        this.turmaRepository = turmaRepository;
        this.moduloRepository = moduloRepository;
        this.topicoRepository = topicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.recursoRepository = recursoRepository;
        this.practiceRepository = practiceRepository;
        this.practiceRespostaRepository = practiceRespostaRepository;
        this.productionRepository = productionRepository;
        this.submissaoRepository = submissaoRepository;
        this.progressoItemRepository = progressoItemRepository;
        this.progressoRepository = progressoRepository;
        this.progressoItemService = progressoItemService;
    }

    @Transactional(readOnly = true)
    public TeacherStudioDashboardDTO dashboard(Usuario docente) {
        exigirDocente(docente);
        List<Turma> turmas = turmaRepository.findByDocenteIdOrderByPeriodoDescNomeAsc(docente.getId());
        List<Modulo> modulos = new java.util.ArrayList<>(
                moduloRepository.findByCriadoPorIdOrderByIdDesc(docente.getId()));
        modulos.addAll(moduloRepository.findByCriadoPorIsNullAndPublicadoTrue());
        List<ProductionSubmissao> submissoes =
            submissaoRepository.findAllByOrderByDataSubmissaoDesc();

        Map<Long, Turma> turmaPorModulo = new HashMap<>();
        turmas.forEach(turma -> turma.getModulos().forEach(modulo -> turmaPorModulo.put(modulo.getId(), turma)));
        Map<Long, Turma> turmaPorAluno = new HashMap<>();
        turmas.forEach(turma -> turma.getAlunos()
            .forEach(aluno -> turmaPorAluno.putIfAbsent(aluno.getId(), turma)));

        List<TeacherStudioDashboardDTO.TurmaResumo> turmasDto = turmas.stream()
            .map(t -> new TeacherStudioDashboardDTO.TurmaResumo(
                t.getId(), t.getNome(), t.getPeriodo(), t.getIdioma().name(),
                t.getAlunos().size(), t.getModulos().size()))
            .toList();

        List<TeacherStudioDashboardDTO.ModuloResumo> modulosDto = modulos.stream()
            .map(m -> {
                Turma turma = turmaPorModulo.get(m.getId());
                return new TeacherStudioDashboardDTO.ModuloResumo(
                    m.getId(),
                    turma == null ? null : turma.getId(),
                    m.getCriadoPor() == null
                        ? "Biblioteca EnglishVerse"
                        : turma == null ? "Conteúdo próprio" : turma.getNome(),
                    m.getTitulo(),
                    m.getDescricao(),
                    m.getImagemCapaUrl(),
                    nivel(m).name(),
                    Boolean.TRUE.equals(m.getPublicado()),
                    recursoRepository.findByModuloIdOrderByOrdemAsc(m.getId()).size(),
                    practiceRepository.findByModuloId(m.getId()).size(),
                    productionRepository.findByModuloId(m.getId()).size(),
                    m.getCriadoPor() != null && m.getCriadoPor().getId().equals(docente.getId()),
                    m.getCriadoPor() == null);
            })
            .toList();

        List<TeacherStudioDashboardDTO.ConteudoResumo> conteudosDto = modulos.stream()
            .filter(m -> m.getCriadoPor() != null
                && m.getCriadoPor().getId().equals(docente.getId()))
            .flatMap(m -> {
                List<TeacherStudioDashboardDTO.ConteudoResumo> conteudos = new ArrayList<>();
                recursoRepository.findByModuloIdOrderByOrdemAsc(m.getId()).forEach(recurso -> {
                    Map<String, Object> dados = new HashMap<>();
                    if (recurso.getLetra() != null) {
                        dados.put("letra", recurso.getLetra());
                    }
                    if (recurso.getBlocos() != null) {
                        dados.put("blocos", recurso.getBlocos());
                    }
                    conteudos.add(new TeacherStudioDashboardDTO.ConteudoResumo(
                        recurso.getId(), m.getId(), EtapaConteudo.APRESENTACAO.name(),
                        recurso.getTipoRecurso().name(),
                        recurso.getMediaCategory() == null ? null : recurso.getMediaCategory().name(),
                        null, recurso.getUrlRecurso(), recurso.getTranscricao(),
                        recurso.getOrdem(), dados));
                });
                practiceRepository.findByModuloIdOrderByIdAsc(m.getId()).forEach(atividade ->
                    conteudos.add(new TeacherStudioDashboardDTO.ConteudoResumo(
                        atividade.getId(), m.getId(), EtapaConteudo.PRATICA.name(),
                        atividade.getTipoAtividade().name(),
                        atividade.getMediaCategory() == null ? null : atividade.getMediaCategory().name(),
                        atividade.getInstrucao(), null, null, null,
                        atividade.getDadosAtividade())));
                productionRepository.findByModuloIdOrderByIdAsc(m.getId()).forEach(desafio ->
                    conteudos.add(new TeacherStudioDashboardDTO.ConteudoResumo(
                        desafio.getId(), m.getId(), EtapaConteudo.PRODUCTION.name(),
                        desafio.getTipoDesafio().name(),
                        desafio.getMediaCategory() == null ? null : desafio.getMediaCategory().name(),
                        desafio.getInstrucaoDesafio(), desafio.getMidiaDesafioUrl(),
                        null, null, desafio.getDadosDesafio())));
                return conteudos.stream();
            })
            .toList();

        List<TeacherStudioDashboardDTO.SubmissaoResumo> submissoesDto = submissoes.stream()
            .map(s -> submissaoResumo(
                s,
                turmaPorAluno.getOrDefault(
                    s.getAluno().getId(),
                    turmaPorModulo.get(s.getChallenge().getModulo().getId()))))
            .toList();

        long alunos = turmas.stream()
            .flatMap(t -> t.getAlunos().stream())
            .map(Usuario::getId)
            .distinct()
            .count();
        long pendentes = submissoes.stream()
            .filter(s -> status(s) == StatusCorrecao.PENDENTE)
            .count();

        return new TeacherStudioDashboardDTO(
            new TeacherStudioDashboardDTO.Resumo(turmas.size(), alunos, modulos.size(), pendentes),
            turmasDto,
            modulosDto,
            conteudosDto,
            submissoesDto);
    }

    @Transactional
    public Turma criarTurma(Usuario docente, TeacherTurmaRequestDTO request) {
        exigirDocente(docente);
        if (request.nome() == null || request.nome().isBlank()
                || request.periodo() == null || request.periodo().isBlank()
                || request.idioma() == null) {
            throw new IllegalArgumentException("Nome, período e idioma são obrigatórios.");
        }

        Turma turma = new Turma();
        turma.setNome(request.nome().trim());
        turma.setPeriodo(request.periodo().trim());
        turma.setIdioma(request.idioma());
        turma.setDocente(docente);
        turma.setAlunos(new LinkedHashSet<>());
        turma.setModulos(new LinkedHashSet<>());

        if (request.alunosEmails() != null) {
            request.alunosEmails().stream()
                .filter(email -> email != null && !email.isBlank())
                .map(String::trim)
                .map(usuarioRepository::findByEmail)
                .flatMap(java.util.Optional::stream)
                .filter(aluno -> aluno.getPerfilResolvido() == TipoPerfil.DISCENTE)
                .forEach(turma.getAlunos()::add);
        }
        return turmaRepository.save(turma);
    }

    @Transactional
    public Modulo criarModulo(Usuario docente, TeacherModuleRequestDTO request) {
        exigirDocente(docente);
        Turma turma = request.turmaId() == null
            ? null
            : turmaDoDocente(request.turmaId(), docente);
        if (request.titulo() == null || request.titulo().isBlank()) {
            throw new IllegalArgumentException("O título do módulo é obrigatório.");
        }
        NivelDificuldade nivel = request.nivel() == null
                ? NivelDificuldade.INICIANTE : request.nivel();
        String nomeTopico = switch (nivel) {
            case INICIANTE -> "Iniciante";
            case INTERMEDIARIO -> "Intermediário";
            case AVANCADO -> "Avançado";
        };
        Topico topico = topicoRepository.findByNome(nomeTopico).orElseGet(() -> {
            Topico novo = new Topico();
            novo.setNome(nomeTopico);
            novo.setDescricao("Conteúdos de nível " + nomeTopico.toLowerCase() + ".");
            return topicoRepository.save(novo);
        });

        Modulo modulo = new Modulo();
        modulo.setTopico(topico);
        modulo.setTitulo(request.titulo().trim());
        modulo.setDescricao(request.descricao());
        modulo.setImagemCapaUrl(request.imagemCapaUrl());
        modulo.setNivelDificuldade(nivel);
        modulo.setPublicado(Boolean.TRUE.equals(request.publicado()));
        modulo.setCriadoPor(docente);
        Modulo salvo = moduloRepository.save(modulo);
        if (turma != null) {
            turma.getModulos().add(salvo);
            turmaRepository.save(turma);
        }
        return salvo;
    }

    @Transactional
    public Modulo atualizarModulo(
            Usuario docente, Long moduloId, TeacherModuleRequestDTO request) {
        exigirDocente(docente);
        Modulo modulo = moduloDoDocente(moduloId, docente);
        Turma turma = request.turmaId() == null
            ? null
            : turmaDoDocente(request.turmaId(), docente);
        if (request.titulo() == null || request.titulo().isBlank()) {
            throw new IllegalArgumentException("O título do módulo é obrigatório.");
        }

        modulo.setTitulo(request.titulo().trim());
        modulo.setDescricao(request.descricao());
        modulo.setImagemCapaUrl(request.imagemCapaUrl());
        NivelDificuldade nivel = request.nivel() == null
            ? NivelDificuldade.INICIANTE : request.nivel();
        modulo.setNivelDificuldade(nivel);
        modulo.setTopico(topicoDoNivel(nivel));
        modulo.setPublicado(Boolean.TRUE.equals(request.publicado()));
        Modulo salvo = moduloRepository.save(modulo);

        List<Turma> turmas = turmaRepository
            .findByDocenteIdOrderByPeriodoDescNomeAsc(docente.getId());
        turmas.forEach(item -> item.getModulos()
            .removeIf(existing -> existing.getId().equals(moduloId)));
        if (turma != null) {
            turma.getModulos().add(salvo);
        }
        turmaRepository.saveAll(turmas);
        return salvo;
    }

    @Transactional
    public void excluirModulo(Usuario docente, Long moduloId) {
        exigirDocente(docente);
        Modulo modulo = moduloDoDocente(moduloId, docente);

        List<Turma> turmas = turmaRepository
            .findByDocenteIdOrderByPeriodoDescNomeAsc(docente.getId());
        turmas.forEach(turma -> turma.getModulos()
            .removeIf(existing -> existing.getId().equals(moduloId)));
        turmaRepository.saveAll(turmas);

        submissaoRepository.deleteByChallengeModuloId(moduloId);
        practiceRespostaRepository.deleteByAtividadeModuloId(moduloId);
        progressoItemRepository.deleteByModuloId(moduloId);
        progressoRepository.deleteByModuloId(moduloId);
        recursoRepository.deleteByModuloId(moduloId);
        practiceRepository.deleteByModuloId(moduloId);
        productionRepository.deleteByModuloId(moduloId);
        moduloRepository.delete(modulo);
    }

    @Transactional
    public Object criarConteudo(Usuario docente, TeacherContentRequestDTO request) {
        exigirDocente(docente);
        Modulo modulo = moduloDoDocente(request.moduloId(), docente);
        if (request.etapa() == null || request.tipo() == null || request.tipo().isBlank()) {
            throw new IllegalArgumentException("A etapa e o tipo da atividade são obrigatórios.");
        }
        Map<String, Object> dados = request.dados() == null ? Map.of() : request.dados();

        return switch (request.etapa()) {
            case APRESENTACAO -> {
                RecursoApresentacao recurso = new RecursoApresentacao();
                recurso.setModulo(modulo);
                recurso.setTipoRecurso(TipoRecurso.valueOf(request.tipo()));
                recurso.setMediaCategory(request.classificacao());
                recurso.setUrlRecurso(request.midiaUrl() == null ? "" : request.midiaUrl().trim());
                recurso.setTranscricao(request.transcricao());
                recurso.setLetra((String) dados.getOrDefault("letra", null));
                recurso.setBlocos(blocosApresentacao(dados));
                recurso.setOrdem(request.ordem() == null ? 1 : request.ordem());
                yield recursoRepository.save(recurso);
            }
            case PRATICA -> {
                PracticeAtividade atividade = new PracticeAtividade();
                atividade.setModulo(modulo);
                atividade.setTipoAtividade(TipoAtividade.valueOf(request.tipo()));
                atividade.setMediaCategory(request.classificacao());
                atividade.setInstrucao(request.instrucao());
                atividade.setDadosAtividade(dados);
                yield practiceRepository.save(atividade);
            }
            case PRODUCTION -> {
                ProductionChallenge desafio = new ProductionChallenge();
                desafio.setModulo(modulo);
                desafio.setTipoDesafio(TipoDesafio.valueOf(request.tipo()));
                desafio.setMediaCategory(request.classificacao());
                desafio.setInstrucaoDesafio(request.instrucao());
                desafio.setMidiaDesafioUrl(request.midiaUrl());
                desafio.setDadosDesafio(dados);
                yield productionRepository.save(desafio);
            }
        };
    }

    @Transactional
    public Object atualizarConteudo(
            Usuario docente,
            EtapaConteudo etapa,
            Long conteudoId,
            TeacherContentRequestDTO request) {
        exigirDocente(docente);
        if (etapa == null || request.tipo() == null || request.tipo().isBlank()) {
            throw new IllegalArgumentException("A etapa e o tipo da atividade são obrigatórios.");
        }
        Map<String, Object> dados = request.dados() == null ? Map.of() : request.dados();

        return switch (etapa) {
            case APRESENTACAO -> {
                RecursoApresentacao recurso = recursoRepository.findById(conteudoId)
                    .orElseThrow(() -> new IllegalArgumentException("Apresentação não encontrada."));
                moduloDoDocente(recurso.getModulo().getId(), docente);
                recurso.setTipoRecurso(TipoRecurso.valueOf(request.tipo()));
                recurso.setMediaCategory(request.classificacao());
                recurso.setUrlRecurso(
                    request.midiaUrl() == null ? "" : request.midiaUrl().trim());
                recurso.setTranscricao(request.transcricao());
                recurso.setLetra((String) dados.getOrDefault("letra", null));
                recurso.setBlocos(blocosApresentacao(dados));
                recurso.setOrdem(request.ordem() == null ? 1 : request.ordem());
                yield recursoRepository.save(recurso);
            }
            case PRATICA -> {
                PracticeAtividade atividade = practiceRepository.findById(conteudoId)
                    .orElseThrow(() -> new IllegalArgumentException("Atividade não encontrada."));
                moduloDoDocente(atividade.getModulo().getId(), docente);
                atividade.setTipoAtividade(TipoAtividade.valueOf(request.tipo()));
                atividade.setMediaCategory(request.classificacao());
                atividade.setInstrucao(request.instrucao());
                atividade.setDadosAtividade(dados);
                yield practiceRepository.save(atividade);
            }
            case PRODUCTION -> {
                ProductionChallenge desafio = productionRepository.findById(conteudoId)
                    .orElseThrow(() -> new IllegalArgumentException("Production não encontrada."));
                moduloDoDocente(desafio.getModulo().getId(), docente);
                desafio.setTipoDesafio(TipoDesafio.valueOf(request.tipo()));
                desafio.setMediaCategory(request.classificacao());
                desafio.setInstrucaoDesafio(request.instrucao());
                desafio.setMidiaDesafioUrl(request.midiaUrl());
                desafio.setDadosDesafio(dados);
                yield productionRepository.save(desafio);
            }
        };
    }

    @Transactional
    public void excluirConteudo(
            Usuario docente, EtapaConteudo etapa, Long conteudoId) {
        exigirDocente(docente);
        switch (etapa) {
            case APRESENTACAO -> {
                RecursoApresentacao recurso = recursoRepository.findById(conteudoId)
                    .orElseThrow(() -> new IllegalArgumentException("Apresentação não encontrada."));
                moduloDoDocente(recurso.getModulo().getId(), docente);
                progressoItemRepository.deleteByModuloIdAndItemIdAndItemType(
                    recurso.getModulo().getId(), recurso.getId(), ItemType.PRESENTATION);
                recursoRepository.delete(recurso);
            }
            case PRATICA -> {
                PracticeAtividade atividade = practiceRepository.findById(conteudoId)
                    .orElseThrow(() -> new IllegalArgumentException("Atividade não encontrada."));
                moduloDoDocente(atividade.getModulo().getId(), docente);
                practiceRespostaRepository.deleteByAtividadeId(atividade.getId());
                progressoItemRepository.deleteByModuloIdAndItemIdAndItemType(
                    atividade.getModulo().getId(), atividade.getId(), ItemType.PRACTICE);
                practiceRepository.delete(atividade);
            }
            case PRODUCTION -> {
                ProductionChallenge desafio = productionRepository.findById(conteudoId)
                    .orElseThrow(() -> new IllegalArgumentException("Production não encontrada."));
                moduloDoDocente(desafio.getModulo().getId(), docente);
                submissaoRepository.deleteByChallengeId(desafio.getId());
                progressoItemRepository.deleteByModuloIdAndItemIdAndItemType(
                    desafio.getModulo().getId(), desafio.getId(), ItemType.PRODUCTION);
                productionRepository.delete(desafio);
            }
        }
    }

    @Transactional
    public TeacherReviewResultDTO corrigir(
            Usuario docente, Long submissaoId, TeacherReviewRequestDTO request) {
        exigirDocente(docente);
        ProductionSubmissao submissao = submissaoRepository.findById(submissaoId)
            .orElseThrow(() -> new IllegalArgumentException("Submissão não encontrada."));
        if (request.status() != StatusCorrecao.APROVADA
                && request.status() != StatusCorrecao.AJUSTES_SOLICITADOS) {
            throw new IllegalArgumentException("Escolha aprovar ou solicitar ajustes.");
        }
        if (Boolean.TRUE.equals(submissao.getXpConcedido())
                && request.status() != StatusCorrecao.APROVADA) {
            throw new IllegalStateException("O XP desta Production já foi liberado.");
        }

        submissao.setFeedbackProfessor(request.feedback());
        submissao.setNota(request.nota());
        submissao.setStatusCorrecao(request.status());
        submissao.setDataCorrecao(LocalDateTime.now());
        submissaoRepository.save(submissao);

        boolean xpLiberado = false;
        int xp = 0;
        if (request.status() == StatusCorrecao.APROVADA
                && !Boolean.TRUE.equals(submissao.getXpConcedido())) {
            ProgressItemCompletionDTO completion = progressoItemService.marcarComoConcluido(
                submissao.getAluno().getId(),
                submissao.getChallenge().getModulo().getId(),
                submissao.getChallenge().getId(),
                ItemType.PRODUCTION,
                true);
            xp = completion.reward().xpGained();
            xpLiberado = xp > 0;
            submissao.setXpConcedido(true);
            submissaoRepository.save(submissao);
        }
        return new TeacherReviewResultDTO(
            submissao.getId(), submissao.getStatusCorrecao().name(), xpLiberado, xp);
    }

    private TeacherStudioDashboardDTO.SubmissaoResumo submissaoResumo(
            ProductionSubmissao s, Turma turma) {
        return new TeacherStudioDashboardDTO.SubmissaoResumo(
            s.getId(),
            s.getAluno().getId(),
            s.getAluno().getNome(),
            turma == null ? "Todos os alunos" : turma.getNome(),
            s.getChallenge().getModulo().getTitulo(),
            s.getChallenge().getInstrucaoDesafio(),
            s.getChallenge().getTipoDesafio().name(),
            status(s).name(),
            s.getResposta(),
            s.getFeedbackProfessor(),
            s.getNota(),
            s.getDataSubmissao());
    }

    private StatusCorrecao status(ProductionSubmissao submissao) {
        return submissao.getStatusCorrecao() == null
                ? StatusCorrecao.PENDENTE : submissao.getStatusCorrecao();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> blocosApresentacao(Map<String, Object> dados) {
        Object blocos = dados.get("blocos");
        if (!(blocos instanceof List<?> lista)) {
            return List.of();
        }
        return lista.stream()
            .filter(Map.class::isInstance)
            .map(item -> (Map<String, Object>) item)
            .toList();
    }

    private NivelDificuldade nivel(Modulo modulo) {
        return modulo.getNivelDificuldade() == null
                ? NivelDificuldade.INICIANTE : modulo.getNivelDificuldade();
    }

    private Topico topicoDoNivel(NivelDificuldade nivel) {
        String nomeTopico = switch (nivel) {
            case INICIANTE -> "Iniciante";
            case INTERMEDIARIO -> "Intermediário";
            case AVANCADO -> "Avançado";
        };
        return topicoRepository.findByNome(nomeTopico).orElseGet(() -> {
            Topico novo = new Topico();
            novo.setNome(nomeTopico);
            novo.setDescricao("Conteúdos de nível " + nomeTopico.toLowerCase() + ".");
            return topicoRepository.save(novo);
        });
    }

    private Turma turmaDoDocente(Long turmaId, Usuario docente) {
        Turma turma = turmaRepository.findById(turmaId)
            .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada."));
        if (!turma.getDocente().getId().equals(docente.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Esta turma pertence a outro docente.");
        }
        return turma;
    }

    private Modulo moduloDoDocente(Long moduloId, Usuario docente) {
        Modulo modulo = moduloRepository.findById(moduloId)
            .orElseThrow(() -> new IllegalArgumentException("Módulo não encontrado."));
        if (modulo.getCriadoPor() == null || !modulo.getCriadoPor().getId().equals(docente.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este módulo pertence a outro docente.");
        }
        return modulo;
    }

    private void exigirDocente(Usuario usuario) {
        if (usuario == null || usuario.getPerfilResolvido() != TipoPerfil.DOCENTE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso exclusivo para docentes.");
        }
    }
}
