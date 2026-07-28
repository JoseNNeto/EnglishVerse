package com.joseneto.englishverse.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joseneto.englishverse.dtos.TeacherContentRequestDTO;
import com.joseneto.englishverse.dtos.TeacherModuleRequestDTO;
import com.joseneto.englishverse.dtos.TeacherReviewRequestDTO;
import com.joseneto.englishverse.dtos.TeacherReviewResultDTO;
import com.joseneto.englishverse.dtos.TeacherStudioDashboardDTO;
import com.joseneto.englishverse.dtos.TeacherTurmaRequestDTO;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.model.enums.EtapaConteudo;
import com.joseneto.englishverse.service.TeacherStudioService;

@RestController
@RequestMapping("/api/teacher-studio")
public class TeacherStudioController {
    private final TeacherStudioService service;

    public TeacherStudioController(TeacherStudioService service) {
        this.service = service;
    }

    @GetMapping
    public TeacherStudioDashboardDTO dashboard(@AuthenticationPrincipal Usuario docente) {
        return service.dashboard(docente);
    }

    @PostMapping("/turmas")
    public ResponseEntity<Void> criarTurma(
            @AuthenticationPrincipal Usuario docente,
            @RequestBody TeacherTurmaRequestDTO request) {
        service.criarTurma(docente, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/modulos")
    public ResponseEntity<Map<String, Long>> criarModulo(
            @AuthenticationPrincipal Usuario docente,
            @RequestBody TeacherModuleRequestDTO request) {
        var modulo = service.criarModulo(docente, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", modulo.getId()));
    }

    @PutMapping("/modulos/{id}")
    public ResponseEntity<Void> atualizarModulo(
            @AuthenticationPrincipal Usuario docente,
            @PathVariable Long id,
            @RequestBody TeacherModuleRequestDTO request) {
        service.atualizarModulo(docente, id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/modulos/{id}")
    public ResponseEntity<Void> excluirModulo(
            @AuthenticationPrincipal Usuario docente,
            @PathVariable Long id) {
        service.excluirModulo(docente, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/conteudos")
    public ResponseEntity<Void> criarConteudo(
            @AuthenticationPrincipal Usuario docente,
            @RequestBody TeacherContentRequestDTO request) {
        service.criarConteudo(docente, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/conteudos/{etapa}/{id}")
    public ResponseEntity<Void> atualizarConteudo(
            @AuthenticationPrincipal Usuario docente,
            @PathVariable EtapaConteudo etapa,
            @PathVariable Long id,
            @RequestBody TeacherContentRequestDTO request) {
        service.atualizarConteudo(docente, etapa, id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/conteudos/{etapa}/{id}")
    public ResponseEntity<Void> excluirConteudo(
            @AuthenticationPrincipal Usuario docente,
            @PathVariable EtapaConteudo etapa,
            @PathVariable Long id) {
        service.excluirConteudo(docente, etapa, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/submissoes/{id}/correcao")
    public TeacherReviewResultDTO corrigir(
            @AuthenticationPrincipal Usuario docente,
            @PathVariable Long id,
            @RequestBody TeacherReviewRequestDTO request) {
        return service.corrigir(docente, id, request);
    }
}
