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

import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.service.ModuloService;

@RestController
@RequestMapping("/api/modulos")
public class ModuloController {
    @Autowired
    private ModuloService moduloService;

    @GetMapping
    public List<Modulo> listar() {
        return moduloService.listarTodos();
    }

    // Endpoint especial: Listar módulos de um tópico X
    // Ex: GET /api/modulos/topico/1
    @GetMapping("/topico/{topicoId}")
    public List<Modulo> listarPorTopico(@PathVariable Long topicoId) {
        return moduloService.listarPorTopico(topicoId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Modulo> buscarPorId(@PathVariable Long id) {
        return moduloService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Modulo> criar(@RequestBody Modulo modulo) {
        try {
            // No JSON de envio, tu vai ter que mandar assim:
            // { "titulo": "...", "topico": { "id": 1 } }
            Modulo novoModulo = moduloService.salvar(modulo);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoModulo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Modulo> atualizar(@PathVariable Long id, @RequestBody Modulo modulo) {
        try {
            return ResponseEntity.ok(moduloService.atualizar(id, modulo));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        moduloService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
