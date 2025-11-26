package com.joseneto.englishverse.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joseneto.englishverse.dtos.LoginResponseDTO;
import com.joseneto.englishverse.dtos.NomeUpdateRequestDTO;
import com.joseneto.englishverse.dtos.SenhaUpdateRequestDTO;
import com.joseneto.englishverse.dtos.UsuarioRequestDTO;
import com.joseneto.englishverse.dtos.UsuarioResponseDTO;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.service.TokenService;
import com.joseneto.englishverse.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return usuarioService.listarTodos().stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(usuario -> ResponseEntity.ok(new UsuarioResponseDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LoginResponseDTO> criar(@RequestBody UsuarioRequestDTO usuarioDTO) {
        try {
            // 1. Cria o usuário no banco de dados
            usuarioService.criarUsuario(usuarioDTO);

            // 2. Autentica o usuário recém-criado
            var usernamePassword = new UsernamePasswordAuthenticationToken(usuarioDTO.email(), usuarioDTO.senha());
            Authentication auth = this.authenticationManager.authenticate(usernamePassword);

            // 3. Gera o token para a nova sessão
            var token = tokenService.generateToken((Usuario) auth.getPrincipal());

            // 4. Retorna o token
            return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponseDTO(token));
        } catch (Exception e) {
            // Considerar um tratamento de erro mais específico aqui
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/me/nome")
    public ResponseEntity<LoginResponseDTO> atualizarNome(@AuthenticationPrincipal Usuario usuario, @RequestBody NomeUpdateRequestDTO nomeUpdateRequestDTO) {
        try {
            Usuario usuarioAtualizado = usuarioService.atualizarNome(usuario.getEmail(), nomeUpdateRequestDTO.nome());
            var token = tokenService.generateToken(usuarioAtualizado);
            return ResponseEntity.ok(new LoginResponseDTO(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/me/senha")
    public ResponseEntity<?> atualizarSenha(@AuthenticationPrincipal Usuario usuario, @RequestBody SenhaUpdateRequestDTO senhaUpdateRequestDTO) {
        try {
            Usuario usuarioAtualizado = usuarioService.atualizarSenha(usuario.getEmail(), senhaUpdateRequestDTO.senhaAntiga(), senhaUpdateRequestDTO.senhaNova());
            var token = tokenService.generateToken(usuarioAtualizado);
            return ResponseEntity.ok(new LoginResponseDTO(token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
