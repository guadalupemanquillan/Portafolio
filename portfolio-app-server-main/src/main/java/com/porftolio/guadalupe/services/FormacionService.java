package com.porftolio.guadalupe.services;

import com.porftolio.guadalupe.models.Formacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface FormacionService {
    Page<Formacion> list(Pageable pageable);
    Optional<Formacion> findById(String id);
    Formacion create(Formacion formacion);
    Formacion update(String id, Formacion formacion);
    void delete(String id);
}
