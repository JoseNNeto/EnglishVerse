package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record TeacherStudioDashboardDTO(
    Resumo resumo,
    List<TurmaResumo> turmas,
    List<ModuloResumo> modulos,
    List<ConteudoResumo> conteudos,
    List<SubmissaoResumo> submissoes
) {
    public record Resumo(long turmas, long alunos, long modulos, long pendentes) {}

    public record TurmaResumo(
        Long id,
        String nome,
        String periodo,
        String idioma,
        int alunos,
        int modulos
    ) {}

    public record ModuloResumo(
        Long id,
        Long turmaId,
        String turma,
        String titulo,
        String descricao,
        String imagemCapaUrl,
        String nivel,
        boolean publicado,
        int apresentacoes,
        int praticas,
        int productions,
        boolean editavel,
        boolean biblioteca
    ) {}

    public record ConteudoResumo(
        Long id,
        Long moduloId,
        String etapa,
        String tipo,
        String classificacao,
        String instrucao,
        String midiaUrl,
        String transcricao,
        Integer ordem,
        Map<String, Object> dados
    ) {}

    public record SubmissaoResumo(
        Long id,
        Long alunoId,
        String aluno,
        String turma,
        String modulo,
        String atividade,
        String tipo,
        String status,
        Map<String, Object> resposta,
        String feedback,
        Integer nota,
        LocalDateTime enviadaEm
    ) {}
}
