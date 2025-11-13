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

import com.joseneto.englishverse.model.ProductionChallenge;
import com.joseneto.englishverse.service.ProductionChallengeService;

@RestController
@RequestMapping("/api/production")
public class ProductionChallengeController {
    @Autowired
    private ProductionChallengeService service;

    @GetMapping("/modulo/{moduloId}")
    public List<ProductionChallenge> listarPorModulo(@PathVariable Long moduloId) {
        return service.listarPorModulo(moduloId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductionChallenge> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductionChallenge> criar(@RequestBody ProductionChallenge challenge) {
        try {
            // O JSON que tu mandar no corpo da requisição vai cair direto no Map
            ProductionChallenge novo = service.salvar(challenge);
            return ResponseEntity.status(HttpStatus.CREATED).body(novo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductionChallenge> atualizar(@PathVariable Long id, @RequestBody ProductionChallenge challenge) {
        try {
            return ResponseEntity.ok(service.atualizar(id, challenge));
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
