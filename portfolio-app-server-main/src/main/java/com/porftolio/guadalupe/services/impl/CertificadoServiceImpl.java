package com.porftolio.guadalupe.services.impl;

import com.porftolio.guadalupe.models.Certificado;
import com.porftolio.guadalupe.repositories.CertificadoRepository;
import com.porftolio.guadalupe.services.CertificadoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificadoServiceImpl implements CertificadoService {

    private final CertificadoRepository repository;

    public CertificadoServiceImpl(CertificadoRepository repository) {
        this.repository = repository;
    }

    @Override
    public Certificado create(Certificado c, MultipartFile file) throws IOException {
        c.setId(null);
        normalize(c);
        if (c.getVisible() == null) {
            c.setVisible(true);
        }
        if (c.getFeatured() == null) {
            c.setFeatured(false);
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Debés subir una imagen o un PDF del certificado");
        }
        var stored = storeFile(file);
        c.setFileUrl(stored.path());
        c.setMediaType(stored.mediaType());
        return repository.save(c);
    }

    @Override
    public Certificado update(String id, Certificado incoming, MultipartFile file) throws IOException {
        Certificado current = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certificado no encontrado: " + id));
        String oldPath = current.getFileUrl();
        current.setTitle(incoming.getTitle());
        current.setIssuer(incoming.getIssuer());
        current.setIssuedDate(incoming.getIssuedDate());
        current.setCredentialUrl(emptyToNull(incoming.getCredentialUrl()));
        current.setPosicion(incoming.getPosicion());
        if (incoming.getVisible() != null) {
            current.setVisible(incoming.getVisible());
        }
        if (incoming.getFeatured() != null) {
            current.setFeatured(incoming.getFeatured());
        }
        normalize(current);

        if (file != null && !file.isEmpty()) {
            var stored = storeFile(file);
            current.setFileUrl(stored.path());
            current.setMediaType(stored.mediaType());
            if (oldPath != null && !oldPath.isBlank() && !oldPath.equals(current.getFileUrl())) {
                deleteLocalUploadIfExists(oldPath);
            }
        }

        return repository.save(current);
    }

    @Override
    public void delete(String id) {
        repository.findById(id).ifPresent(c -> {
            String p = c.getFileUrl();
            repository.deleteById(id);
            if (p != null && !p.isBlank()) {
                deleteLocalUploadIfExists(p);
            }
        });
    }

    @Override
    public Optional<Certificado> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public Page<Certificado> listVisible(Pageable pageable) {
        return repository.findAllByVisibleIsTrue(pageable);
    }

    @Override
    public Page<Certificado> listAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    private void normalize(Certificado c) {
        if (c.getTitle() != null) {
            c.setTitle(c.getTitle().trim());
        }
        if (c.getIssuer() != null) {
            c.setIssuer(c.getIssuer().trim());
        }
        if (c.getIssuedDate() != null) {
            c.setIssuedDate(c.getIssuedDate().trim());
        }
    }

    private static String emptyToNull(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }

    private record Stored(String path, String mediaType) {}

    private Stored storeFile(MultipartFile file) throws IOException {
        String original = file.getOriginalFilename();
        String lower = original != null ? original.toLowerCase(Locale.ROOT) : "";
        boolean pdf = lower.endsWith(".pdf") || "application/pdf".equalsIgnoreCase(file.getContentType());
        boolean image = !pdf && (file.getContentType() != null && file.getContentType().startsWith("image/")
                || lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")
                || lower.endsWith(".webp") || lower.endsWith(".gif"));

        if (!pdf && !image) {
            throw new IllegalArgumentException("Formato no permitido. Subí una imagen (png, jpg, webp…) o un PDF");
        }

        Path uploadDir = Paths.get("uploads", "certificados");
        Files.createDirectories(uploadDir);

        String safeName = sanitizeFilename(original == null ? (pdf ? "cert.pdf" : "cert.png") : original);
        String ext = "";
        int dot = safeName.lastIndexOf('.');
        if (dot >= 0) {
            ext = safeName.substring(dot);
            safeName = safeName.substring(0, dot);
        }
        if (ext.isEmpty()) {
            ext = pdf ? ".pdf" : ".png";
        }
        String finalName = safeName + "-" + UUID.randomUUID().toString().substring(0, 8) + ext;
        Path target = uploadDir.resolve(finalName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return new Stored("certificados/" + finalName, pdf ? "pdf" : "image");
    }

    private static String sanitizeFilename(String name) {
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private void deleteLocalUploadIfExists(String fileUrl) {
        try {
            String pathPart = fileUrl;
            int idx = fileUrl.indexOf("/uploads/");
            if (idx >= 0) {
                pathPart = fileUrl.substring(idx + "/uploads/".length());
            } else if (fileUrl.startsWith("/uploads/")) {
                pathPart = fileUrl.substring("/uploads/".length());
            } else if (fileUrl.contains("://")) {
                return;
            } else {
                pathPart = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
                if (pathPart.startsWith("uploads/")) {
                    pathPart = pathPart.substring("uploads/".length());
                }
            }
            Path target = Paths.get("uploads").resolve(pathPart);
            if (Files.exists(target)) {
                Files.delete(target);
            }
        } catch (Exception ignored) {
        }
    }
}
