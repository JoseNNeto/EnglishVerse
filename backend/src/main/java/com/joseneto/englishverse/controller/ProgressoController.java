package com.joseneto.englishverse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.joseneto.englishverse.model.Progresso;
import com.joseneto.englishverse.service.ProgressoService;

@RestController
@RequestMapping("/api/progresso")
public class ProgressoController {
    @Autowired
    private ProgressoService progressoService;

    // POST /api/progresso/iniciar?alunoId=1&moduloId=10
    @PostMapping("/iniciar")
    public ResponseEntity<Progresso> iniciar(@RequestParam Long alunoId, @RequestParam Long moduloId) {
        return ResponseEntity.ok(progressoService.iniciarModulo(alunoId, moduloId));
    }

    // PUT /api/progresso/concluir?alunoId=1&moduloId=10
    @PutMapping("/concluir")
    public ResponseEntity<Progresso> concluir(@RequestParam Long alunoId, @RequestParam Long moduloId) {
        try {
            return ResponseEntity.ok(progressoService.concluirModulo(alunoId, moduloId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET /api/progresso/em-andamento/1
    // Pra preencher aquele carrossel "Continuar Aprendendo"
    @GetMapping("/em-andamento/{alunoId}")
    public ResponseEntity<List<Progresso>> listarEmAndamento(@PathVariable Long alunoId) {
        return ResponseEntity.ok(progressoService.listarEmAndamento(alunoId));
    }
}
