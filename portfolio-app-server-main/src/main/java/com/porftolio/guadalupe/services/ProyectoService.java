package com.porftolio.guadalupe.services;

import com.porftolio.guadalupe.models.Proyecto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface ProyectoService {
    List<Proyecto> list();

    Optional<Proyecto> findById(String id);

    Proyecto create(Proyecto proyecto, MultipartFile imagen) throws IOException;

    Proyecto update(String id, Proyecto proyecto, MultipartFile imagen) throws IOException;

    void delete(String id);
}
