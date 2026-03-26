package com.porftolio.guadalupe.services;

import com.porftolio.guadalupe.models.Experiencia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ExperienciaService {
    Page<Experiencia> list(Pageable pageable);
    Optional<Experiencia> findById(String id);
    Experiencia create(Experiencia experiencia);
    Experiencia update(String id, Experiencia experiencia);
    void delete(String id);
}
