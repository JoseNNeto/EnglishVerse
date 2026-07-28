package com.joseneto.englishverse.dtos;

import com.joseneto.englishverse.model.enums.TipoPerfil;

public record UsuarioRequestDTO(
    String nome,
    String email,
    String senha,
    TipoPerfil perfil
) {}
