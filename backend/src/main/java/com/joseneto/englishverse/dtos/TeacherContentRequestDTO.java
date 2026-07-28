package com.joseneto.englishverse.dtos;

import java.util.Map;

import com.joseneto.englishverse.model.enums.EtapaConteudo;
import com.joseneto.englishverse.model.enums.MediaCategory;

public record TeacherContentRequestDTO(
    Long moduloId,
    EtapaConteudo etapa,
    String tipo,
    MediaCategory classificacao,
    String instrucao,
    String midiaUrl,
    String transcricao,
    Integer ordem,
    Map<String, Object> dados
) {}
