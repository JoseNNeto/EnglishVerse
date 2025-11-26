package com.joseneto.englishverse.dtos;

import java.time.LocalDateTime;

import com.joseneto.englishverse.model.Usuario;

public record UsuarioResponseDTO(
    Long id,
    String nome,
    String email,
    LocalDateTime dataCriacao
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getDataCriacao()
        );
    }
}
