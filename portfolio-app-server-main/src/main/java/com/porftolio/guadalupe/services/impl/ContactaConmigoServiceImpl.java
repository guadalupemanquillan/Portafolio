package com.porftolio.guadalupe.services.impl;

import com.porftolio.guadalupe.models.ContactaConmigo;
import com.porftolio.guadalupe.repositories.ContactaConmigoRepository;
import com.porftolio.guadalupe.services.ContactaConmigoService;
import com.porftolio.guadalupe.services.EmailService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactaConmigoServiceImpl implements ContactaConmigoService {

    private final ContactaConmigoRepository repository;
    private final EmailService emailService;

    public ContactaConmigoServiceImpl(ContactaConmigoRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    @Override
    public ContactaConmigo create(ContactaConmigo message) {
        if (message.getCreatedAt() == null) {
            message.setCreatedAt(LocalDateTime.now());
        }
        message.setProcessed(false);
        ContactaConmigo saved = repository.save(message);
        
        // Send email notification asynchronously
        try {
            emailService.sendContactNotification(saved);
        } catch (Exception e) {
            // Log error but don't fail the request
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
        
        return saved;
    }

    @Override
    public Page<ContactaConmigo> list(Pageable pageable) {
        var page = repository.findAll(pageable);
        return page;
    }

    @Override
    public Page<ContactaConmigo> listByProcessed(boolean processed, Pageable pageable) {
        List<ContactaConmigo> all = repository.findAllByProcessed(processed);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), all.size());
        List<ContactaConmigo> content = start <= end ? all.subList(start, end) : List.of();
        return new PageImpl<>(content, pageable, all.size());
    }

    @Override
    public Optional<ContactaConmigo> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public ContactaConmigo markProcessed(String id, boolean processed) {
        ContactaConmigo entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mensaje no encontrado: " + id));
        entity.setProcessed(processed);
        return repository.save(entity);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }
}
