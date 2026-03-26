package com.porftolio.guadalupe.controllers;

import com.porftolio.guadalupe.models.Proyecto;
import com.porftolio.guadalupe.services.ProyectoService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    private final ProyectoService service;

    public ProyectoController(ProyectoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Proyecto>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proyecto> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Proyecto> create(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "enlaceGithub", required = false) String enlaceGithub,
            @RequestParam(value = "enlaceDespliegue", required = false) String enlaceDespliegue,
            @RequestParam(value = "tecnologias", required = false) List<String> tecnologias,
            @RequestParam(value = "posicion", required = false) Integer posicion,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen
    ) throws IOException {
        Proyecto created = service.create(
                buildProyecto(nombre, descripcion, enlaceGithub, enlaceDespliegue, tecnologias, posicion),
                imagen
        );
        return ResponseEntity.created(URI.create("/api/proyectos/" + created.getId())).body(created);
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Proyecto> update(
            @PathVariable String id,
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "enlaceGithub", required = false) String enlaceGithub,
            @RequestParam(value = "enlaceDespliegue", required = false) String enlaceDespliegue,
            @RequestParam(value = "tecnologias", required = false) List<String> tecnologias,
            @RequestParam(value = "posicion", required = false) Integer posicion,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen
    ) throws IOException {
        Proyecto updated = service.update(
                id,
                buildProyecto(nombre, descripcion, enlaceGithub, enlaceDespliegue, tecnologias, posicion),
                imagen
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Valid
    private Proyecto buildProyecto(
            String nombre,
            String descripcion,
            String enlaceGithub,
            String enlaceDespliegue,
            List<String> tecnologias,
            Integer posicion
    ) {
        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(nombre);
        proyecto.setDescripcion(descripcion);
        proyecto.setEnlaceGithub(enlaceGithub);
        proyecto.setEnlaceDespliegue(enlaceDespliegue);
        proyecto.setTecnologias(tecnologias);
        proyecto.setPosicion(posicion);
        return proyecto;
    }
}
