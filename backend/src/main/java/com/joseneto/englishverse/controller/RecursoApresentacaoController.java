package com.joseneto.englishverse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joseneto.englishverse.model.RecursoApresentacao;
import com.joseneto.englishverse.service.RecursoApresentacaoService;

@RestController
@RequestMapping("/api/recursos")
public class RecursoApresentacaoController {
    @Autowired
    private RecursoApresentacaoService recursoService;

    // Lista todos os recursos de um módulo específico (ex: vídeos da aula 10)
    @GetMapping("/modulo/{moduloId}")
    public List<RecursoApresentacao> listarPorModulo(@PathVariable Long moduloId) {
        return recursoService.listarPorModulo(moduloId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecursoApresentacao> buscarPorId(@PathVariable Long id) {
        return recursoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RecursoApresentacao> criar(@RequestBody RecursoApresentacao recurso) {
        try {
            RecursoApresentacao novoRecurso = recursoService.salvar(recurso);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoRecurso);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecursoApresentacao> atualizar(@PathVariable Long id, @RequestBody RecursoApresentacao recurso) {
        try {
            return ResponseEntity.ok(recursoService.atualizar(id, recurso));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        recursoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
