package com.joseneto.englishverse.controller;

import org.springframework.web.bind.annotation.RestController;

import com.joseneto.englishverse.model.PracticeRespostaUsuario;
import com.joseneto.englishverse.service.PracticeRespostaUsuarioService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/practice-respostas")
public class PracticeRespostaUsuarioController {
    @Autowired
    private PracticeRespostaUsuarioService service;

    @PostMapping
    public ResponseEntity<PracticeRespostaUsuario> responder(@RequestBody PracticeRespostaUsuario resposta) {
        try {
            PracticeRespostaUsuario salva = service.registrarResposta(resposta);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/aluno/{alunoId}")
    public List<PracticeRespostaUsuario> listarHistorico(@PathVariable Long alunoId) {
        return service.listarPorAluno(alunoId);
    }
}
