package com.porftolio.guadalupe.services.impl;

import com.porftolio.guadalupe.models.Habilidad;
import com.porftolio.guadalupe.repositories.HabilidadRepository;
import com.porftolio.guadalupe.services.HabilidadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class HabilidadServiceImpl implements HabilidadService {

    private final HabilidadRepository repository;

    public HabilidadServiceImpl(HabilidadRepository repository) {
        this.repository = repository;
    }

    @Override
    public Habilidad create(Habilidad habilidad, MultipartFile image) throws IOException {
        habilidad.setId(null);
        normalize(habilidad);
        if (image != null && !image.isEmpty()) {
            habilidad.setImage(storeSkillImage(image));
        }
        if (habilidad.getImage() == null || habilidad.getImage().isBlank()) {
            throw new IllegalArgumentException("La imagen es obligatoria al crear una habilidad");
        }
        return repository.save(habilidad);
    }

    @Override
    public Page<Habilidad> list(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<Habilidad> listByCategory(String category, Pageable pageable) {
        return repository.findAllByCategory(category, pageable);
    }

    @Override
    public Optional<Habilidad> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public Habilidad update(String id, Habilidad habilidad, MultipartFile image) throws IOException {
        Habilidad current = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habilidad no encontrada: " + id));
        String oldImage = current.getImage();
        current.setName(habilidad.getName());
        current.setCategory(habilidad.getCategory());
        current.setPosicion(habilidad.getPosicion());
        if (image != null && !image.isEmpty()) {
            String newImage = storeSkillImage(image);
            current.setImage(newImage);
            if (oldImage != null && !oldImage.isBlank() && !oldImage.equals(newImage)) {
                deleteLocalUploadIfExists(oldImage);
            }
        } else if (habilidad.getImage() != null && !habilidad.getImage().isBlank()) {
            current.setImage(habilidad.getImage());
        }
        normalize(current);
        return repository.save(current);
    }

    private void normalize(Habilidad h) {
        if (h.getName() != null) {
            h.setName(h.getName().trim());
        }
        if (h.getCategory() != null) {
            h.setCategory(h.getCategory().trim().toLowerCase());
        }
    }

    private String storeSkillImage(MultipartFile file) throws IOException {
        Path uploadDir = Paths.get("uploads", "habilidades");
        Files.createDirectories(uploadDir);

        String original = file.getOriginalFilename();
        String safeName = sanitizeFilename(original == null ? "skill" : original);
        String ext = "";
        int dot = safeName.lastIndexOf('.');
        if (dot >= 0) {
            ext = safeName.substring(dot);
            safeName = safeName.substring(0, dot);
        }
        String finalName = safeName + "-" + UUID.randomUUID().toString().substring(0, 8) + ext;
        Path target = uploadDir.resolve(finalName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return "habilidades/" + finalName;
    }

    private static String sanitizeFilename(String name) {
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    @Override
    public void delete(String id) {
        repository.findById(id).ifPresent(h -> {
            String img = h.getImage();
            repository.deleteById(id);
            if (img != null && !img.isBlank()) {
                deleteLocalUploadIfExists(img);
            }
        });
    }

    private void deleteLocalUploadIfExists(String imageUrl) {
        try {
            String pathPart = imageUrl;
            int idx = imageUrl.indexOf("/uploads/");
            if (idx >= 0) {
                pathPart = imageUrl.substring(idx + "/uploads/".length());
            } else if (imageUrl.startsWith("/uploads/")) {
                pathPart = imageUrl.substring("/uploads/".length());
            } else if (imageUrl.contains("://")) {
                // URL externa
                return;
            } else {
                // Ruta relativa tipo habilidades/foo.png o proyectos/bar.png
                pathPart = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
                if (pathPart.startsWith("uploads/")) {
                    pathPart = pathPart.substring("uploads/".length());
                }
            }
            Path uploadDir = Paths.get("uploads");
            Path target = uploadDir.resolve(pathPart);
            if (Files.exists(target)) {
                Files.delete(target);
            }
        } catch (Exception ignored) {
            // Swallow exceptions to avoid failing the request due to FS issues
        }
    }
}
