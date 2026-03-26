package com.porftolio.guadalupe.repositories;

import com.porftolio.guadalupe.models.Experiencia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExperienciaRepository extends MongoRepository<Experiencia, String> {
    Page<Experiencia> findAll(Pageable pageable);
}
