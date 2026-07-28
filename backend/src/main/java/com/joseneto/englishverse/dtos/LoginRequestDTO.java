package com.joseneto.englishverse.dtos;

import com.joseneto.englishverse.model.enums.TipoPerfil;

public record LoginRequestDTO(String email, String senha, TipoPerfil perfil) {
}
