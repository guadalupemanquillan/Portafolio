package com.porftolio.guadalupe.services;

import com.porftolio.guadalupe.models.ContactaConmigo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ContactaConmigoService {
    ContactaConmigo create(ContactaConmigo message);
    Page<ContactaConmigo> list(Pageable pageable);
    Page<ContactaConmigo> listByProcessed(boolean processed, Pageable pageable);
    Optional<ContactaConmigo> findById(String id);
    ContactaConmigo markProcessed(String id, boolean processed);
    void delete(String id);
}
