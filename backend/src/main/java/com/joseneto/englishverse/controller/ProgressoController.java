package com.joseneto.englishverse.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.joseneto.englishverse.dtos.ProgressoEmAndamentoResponseDTO; // Added import
import com.joseneto.englishverse.dtos.ProgressoItemRequestDTO;
import com.joseneto.englishverse.dtos.ProgressoItemResponseDTO;
import com.joseneto.englishverse.dtos.UltimoAcessoDTO;
import com.joseneto.englishverse.model.Progresso;
import com.joseneto.englishverse.model.ProgressoItem;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.service.ProgressoService;
import com.joseneto.englishverse.service.ProgressoItemService;

@RestController
@RequestMapping("/api/progresso")
public class ProgressoController {
    @Autowired
    private ProgressoService progressoService;

    @Autowired
    private ProgressoItemService progressoItemService;

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
    public ResponseEntity<List<ProgressoEmAndamentoResponseDTO>> listarEmAndamento(@PathVariable Long alunoId) {
        return ResponseEntity.ok(progressoService.listarEmAndamento(alunoId));
    }

    // POST /api/progresso/item
    @PostMapping("/item")
    public ResponseEntity<ProgressoItemResponseDTO> marcarItemComoConcluido(
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody ProgressoItemRequestDTO dto) {
        try {
            ProgressoItem progressoItem = progressoItemService.marcarComoConcluido(
                    usuario.getId(),
                    dto.moduloId(),
                    dto.itemId(),
                    dto.itemType());
            return ResponseEntity.status(HttpStatus.CREATED).body(new ProgressoItemResponseDTO(progressoItem));
        } catch (RuntimeException e) {
            // Em um sistema real, você retornaria uma mensagem de erro mais detalhada
            return ResponseEntity.badRequest().body(null);
        }
    }

    // GET /api/progresso/modulo/{moduloId}/itens
    @GetMapping("/modulo/{moduloId}/itens")
    public ResponseEntity<List<ProgressoItemResponseDTO>> getProgressoDoModulo(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long moduloId) {
        List<ProgressoItem> progressoItens = progressoItemService.getProgressoPorModulo(
                usuario.getId(),
                moduloId);
        List<ProgressoItemResponseDTO> responseDTOs = progressoItens.stream()
                .map(ProgressoItemResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/modulo/{moduloId}/ultimo-acesso")
    public ResponseEntity<UltimoAcessoDTO> getUltimoAcesso(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long moduloId) {
        return progressoService.getUltimoAcesso(usuario.getId(), moduloId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
