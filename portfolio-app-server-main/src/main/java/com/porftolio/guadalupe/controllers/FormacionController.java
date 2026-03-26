package com.porftolio.guadalupe.controllers;

import com.porftolio.guadalupe.models.Formacion;
import com.porftolio.guadalupe.services.FormacionService;
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
@RequestMapping("/api/formaciones")
public class FormacionController {

    private final FormacionService service;

    public FormacionController(FormacionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<Formacion>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Sort sort = Sort.by(Sort.Order.desc("anoInicio"), Sort.Order.desc("mesInicio"));
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Formacion> result = service.list(pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formacion> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Formacion> create(@Valid @RequestBody Formacion formacion) {
        Formacion created = service.create(formacion);
        return ResponseEntity.created(URI.create("/api/formaciones/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formacion> update(@PathVariable String id, @Valid @RequestBody Formacion formacion) {
        Formacion updated = service.update(id, formacion);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
