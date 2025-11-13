package com.joseneto.englishverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joseneto.englishverse.model.Modulo;

public interface ModuloRepository extends JpaRepository<Modulo, Long> {
    List<Modulo> findByTopicoId(Long topicoId);
    
    List<Modulo> findByPublicadoTrue();
}
