package com.joseneto.englishverse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joseneto.englishverse.model.Topico;

@Repository
public interface TopicoRepository extends JpaRepository<Topico, Long> {
    
}
