package com.porftolio.guadalupe.repositories;

import com.porftolio.guadalupe.models.Habilidad;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HabilidadRepository extends MongoRepository<Habilidad, String> {
    Page<Habilidad> findAllByCategory(String category, Pageable pageable);
}
