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

import com.joseneto.englishverse.model.PracticeAtividade;
import com.joseneto.englishverse.service.PracticeAtividadeService;

@RestController
@RequestMapping("/api/practice")
public class PracticeAtividadeController {
    @Autowired
    private PracticeAtividadeService service;

    // Lista os exercícios de um módulo (GET /api/practice/modulo/10)
    @GetMapping("/modulo/{moduloId}")
    public List<PracticeAtividade> listarPorModulo(@PathVariable Long moduloId) {
        return service.listarPorModulo(moduloId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PracticeAtividade> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PracticeAtividade> criar(@RequestBody PracticeAtividade atividade) {
        try {
            PracticeAtividade nova = service.salvar(atividade);
            return ResponseEntity.status(HttpStatus.CREATED).body(nova);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PracticeAtividade> atualizar(@PathVariable Long id, @RequestBody PracticeAtividade atividade) {
        try {
            return ResponseEntity.ok(service.atualizar(id, atividade));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
