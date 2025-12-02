package com.joseneto.englishverse.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.joseneto.englishverse.model.ProgressoItem;
import com.joseneto.englishverse.model.enums.ItemType;


public interface ProgressoItemRepository extends JpaRepository<ProgressoItem, Long> {
    List<ProgressoItem> findByAlunoIdAndModuloId(Long alunoId, Long moduloId);
    Optional<ProgressoItem> findByAlunoIdAndModuloIdAndItemIdAndItemType(Long alunoId, Long moduloId, Long itemId, ItemType itemType);
    long countByAlunoIdAndModuloId(Long alunoId, Long moduloId);
}
