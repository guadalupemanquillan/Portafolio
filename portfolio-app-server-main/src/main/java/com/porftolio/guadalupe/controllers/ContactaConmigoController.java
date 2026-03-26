package com.porftolio.guadalupe.controllers;

import com.porftolio.guadalupe.models.ContactaConmigo;
import com.porftolio.guadalupe.services.ContactaConmigoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/contact")
public class ContactaConmigoController {

    private final ContactaConmigoService service;

    public ContactaConmigoController(ContactaConmigoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ContactaConmigo> create(@Valid @RequestBody ContactaConmigo body) {
        ContactaConmigo saved = service.create(body);
        return ResponseEntity.created(URI.create("/api/contact/" + saved.getId())).body(saved);
    }

    @GetMapping
    public ResponseEntity<Page<ContactaConmigo>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean processed
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ContactaConmigo> result = (processed == null)
                ? service.list(pageable)
                : service.listByProcessed(processed, pageable);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactaConmigo> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/processed")
    public ResponseEntity<ContactaConmigo> markProcessed(
            @PathVariable String id,
            @RequestParam(defaultValue = "true") boolean value
    ) {
        ContactaConmigo updated = service.markProcessed(id, value);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}