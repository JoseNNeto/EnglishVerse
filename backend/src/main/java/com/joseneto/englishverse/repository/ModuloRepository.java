package com.joseneto.englishverse.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joseneto.englishverse.model.Modulo;

public interface ModuloRepository extends JpaRepository<Modulo, Long> {
    List<Modulo> findByTopicoId(Long topicoId);

    List<Modulo> findByTopicoIdAndPublicadoTrue(Long topicoId);
    
    List<Modulo> findByPublicadoTrue();

    long countByTopicoIdAndPublicadoTrue(Long topicoId);

    Optional<Modulo> findByTitulo(String titulo);

    List<Modulo> findByTituloContainingIgnoreCase(String titulo);
}
