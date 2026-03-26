package com.porftolio.guadalupe.controllers;

import com.porftolio.guadalupe.models.Experiencia;
import com.porftolio.guadalupe.services.ExperienciaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/experiencias")
public class ExperienciaController {

    private final ExperienciaService service;

    public ExperienciaController(ExperienciaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<Experiencia>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Sort sort = Sort.by(Sort.Order.desc("anoInicio"), Sort.Order.desc("mesInicio"));
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Experiencia> result = service.list(pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Experiencia> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Experiencia> create(@Valid @RequestBody Experiencia experiencia) {
        Experiencia created = service.create(experiencia);
        return ResponseEntity.created(URI.create("/api/experiencias/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experiencia> update(@PathVariable String id, @Valid @RequestBody Experiencia experiencia) {
        Experiencia updated = service.update(id, experiencia);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
