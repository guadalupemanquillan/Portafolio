package com.porftolio.guadalupe.services.impl;

import com.porftolio.guadalupe.models.Proyecto;
import com.porftolio.guadalupe.repositories.ProyectoRepository;
import com.porftolio.guadalupe.services.ProyectoService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProyectoServiceImpl implements ProyectoService {

    private final ProyectoRepository repository;

    public ProyectoServiceImpl(ProyectoRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Proyecto> list() {
        return repository.findAll().stream()
                .sorted(Comparator
                        .comparing((Proyecto p) -> p.getPosicion() == null ? Integer.MAX_VALUE : p.getPosicion())
                        .thenComparing(Proyecto::getNombre, Comparator.nullsLast(String::compareToIgnoreCase)))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Proyecto> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public Proyecto create(Proyecto proyecto, MultipartFile imagen) throws IOException {
        proyecto.setId(null);
        normalizeProyecto(proyecto);
        if (imagen != null && !imagen.isEmpty()) {
            proyecto.setImagen(storeImage(imagen));
        }
        return repository.save(proyecto);
    }

    @Override
    public Proyecto update(String id, Proyecto proyecto, MultipartFile imagen) throws IOException {
        Proyecto current = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Proyecto no encontrado: " + id));

        String oldImage = current.getImagen();
        current.setNombre(proyecto.getNombre());
        current.setDescripcion(proyecto.getDescripcion());
        current.setEnlaceGithub(proyecto.getEnlaceGithub());
        current.setEnlaceDespliegue(proyecto.getEnlaceDespliegue());
        current.setTecnologias(proyecto.getTecnologias());
        current.setPosicion(proyecto.getPosicion());
        normalizeProyecto(current);

        if (imagen != null && !imagen.isEmpty()) {
            String newImage = storeImage(imagen);
            current.setImagen(newImage);
            if (oldImage != null && !oldImage.isBlank() && !oldImage.equals(newImage)) {
                deleteLocalUploadIfExists(oldImage);
            }
        }

        return repository.save(current);
    }

    @Override
    public void delete(String id) {
        repository.findById(id).ifPresent(proyecto -> {
            String oldImage = proyecto.getImagen();
            repository.deleteById(id);
            if (oldImage != null && !oldImage.isBlank()) {
                deleteLocalUploadIfExists(oldImage);
            }
        });
    }

    private void normalizeProyecto(Proyecto proyecto) {
        proyecto.setNombre(proyecto.getNombre() == null ? null : proyecto.getNombre().trim());
        proyecto.setDescripcion(proyecto.getDescripcion() == null ? null : proyecto.getDescripcion().trim());
        proyecto.setEnlaceGithub(proyecto.getEnlaceGithub() == null ? "" : proyecto.getEnlaceGithub().trim());
        proyecto.setEnlaceDespliegue(
                proyecto.getEnlaceDespliegue() == null ? "" : proyecto.getEnlaceDespliegue().trim());
        proyecto.setTecnologias(
                proyecto.getTecnologias() == null ? List.of() : proyecto.getTecnologias().stream()
                        .map(t -> t == null ? "" : t.trim())
                        .filter(t -> !t.isBlank())
                        .limit(3)
                        .collect(Collectors.toList()));
    }

    private String storeImage(MultipartFile image) throws IOException {
        Path uploadDir = Paths.get("uploads", "proyectos");
        Files.createDirectories(uploadDir);

        String original = image.getOriginalFilename();
        String safeName = sanitizeFilename(original == null ? "proyecto" : original);
        String ext = "";
        int dot = safeName.lastIndexOf('.');
        if (dot >= 0) {
            ext = safeName.substring(dot);
            safeName = safeName.substring(0, dot);
        }

        String finalName = safeName + "-" + UUID.randomUUID().toString().substring(0, 8) + ext;
        Path target = uploadDir.resolve(finalName);
        Files.copy(image.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return "proyectos/" + finalName;
    }

    private String sanitizeFilename(String raw) {
        String cleaned = raw.replaceAll("[^a-zA-Z0-9._-]", "_");
        if (cleaned.isBlank()) {
            return "archivo";
        }
        return cleaned;
    }

    private void deleteLocalUploadIfExists(String imagePath) {
        try {
            String normalized = imagePath.replace("\\", "/");
            int idx = normalized.indexOf("/uploads/");
            if (idx >= 0) {
                normalized = normalized.substring(idx + "/uploads/".length());
            } else if (normalized.startsWith("uploads/")) {
                normalized = normalized.substring("uploads/".length());
            }
            Path uploads = Paths.get("uploads");
            Path target = uploads.resolve(normalized);
            if (Files.exists(target)) {
                Files.delete(target);
            }
        } catch (Exception ignored) {
            // ignore FS delete issues to avoid blocking API operations
        }
    }
}
