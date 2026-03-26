package com.porftolio.guadalupe.services;

import com.porftolio.guadalupe.models.Habilidad;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface HabilidadService {
    Habilidad create(Habilidad habilidad, MultipartFile image) throws IOException;
    Page<Habilidad> list(Pageable pageable);
    Page<Habilidad> listByCategory(String category, Pageable pageable);
    Optional<Habilidad> findById(String id);
    Habilidad update(String id, Habilidad habilidad, MultipartFile image) throws IOException;
    void delete(String id);
}
