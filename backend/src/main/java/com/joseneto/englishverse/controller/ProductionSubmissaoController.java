package com.joseneto.englishverse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joseneto.englishverse.model.ProductionSubmissao;
import com.joseneto.englishverse.service.ProductionSubmissaoService;

@RestController
@RequestMapping("/api/submissoes")
public class ProductionSubmissaoController {
    @Autowired
    private ProductionSubmissaoService service;

    // Aluno envia a resposta
    @PostMapping
    public ResponseEntity<ProductionSubmissao> enviar(@RequestBody ProductionSubmissao submissao) {
        try {
            ProductionSubmissao nova = service.enviarSubmissao(submissao);
            return ResponseEntity.status(HttpStatus.CREATED).body(nova);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Professor envia o feedback
    // PUT /api/submissoes/10/feedback
    // Body: "Muito bom, Léo! Só cuidado com a pronúncia."
    @PutMapping("/{id}/feedback")
    public ResponseEntity<ProductionSubmissao> darFeedback(@PathVariable Long id, @RequestBody String feedback) {
        try {
            return ResponseEntity.ok(service.registrarFeedback(id, feedback));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/aluno/{alunoId}")
    public List<ProductionSubmissao> listarPorAluno(@PathVariable Long alunoId) {
        return service.listarPorAluno(alunoId);
    }
    
    // Pra tela de correção do professor
    @GetMapping("/desafio/{challengeId}")
    public List<ProductionSubmissao> listarPorDesafio(@PathVariable Long challengeId) {
        return service.listarPorDesafio(challengeId);
    }
}
