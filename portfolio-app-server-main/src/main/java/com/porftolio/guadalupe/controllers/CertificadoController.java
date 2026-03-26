package com.porftolio.guadalupe.controllers;

import com.porftolio.guadalupe.models.Certificado;
import com.porftolio.guadalupe.services.CertificadoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/api/certificados")
public class CertificadoController {

    private final CertificadoService service;

    public CertificadoController(CertificadoService service) {
        this.service = service;
    }

    private static boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }

    @GetMapping
    public ResponseEntity<Page<Certificado>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Authentication authentication
    ) {
        Sort sort = Sort.by(
                Sort.Order.desc("featured"),
                Sort.Order.asc("posicion").nullsLast(),
                Sort.Order.desc("issuedDate")
        );
        Pageable pageable = PageRequest.of(page, size, sort);
        if (isAdmin(authentication)) {
            return ResponseEntity.ok(service.listAll(pageable));
        }
        return ResponseEntity.ok(service.listVisible(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificado> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Certificado> createMultipart(
            @RequestParam("title") String title,
            @RequestParam("issuer") String issuer,
            @RequestParam("issuedDate") String issuedDate,
            @RequestParam(value = "credentialUrl", required = false) String credentialUrl,
            @RequestParam(value = "posicion", required = false) Integer posicion,
            @RequestParam(value = "visible", required = false) Boolean visible,
            @RequestParam(value = "featured", required = false) Boolean featured,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Certificado c = new Certificado();
        c.setTitle(title);
        c.setIssuer(issuer);
        c.setIssuedDate(issuedDate);
        c.setCredentialUrl(credentialUrl);
        c.setPosicion(posicion);
        c.setVisible(visible == null || visible);
        c.setFeatured(featured != null && featured);
        Certificado saved = service.create(c, file);
        return ResponseEntity.created(URI.create("/api/certificados/" + saved.getId())).body(saved);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Certificado> updateMultipart(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("issuer") String issuer,
            @RequestParam("issuedDate") String issuedDate,
            @RequestParam(value = "credentialUrl", required = false) String credentialUrl,
            @RequestParam(value = "posicion", required = false) Integer posicion,
            @RequestParam(value = "visible", required = false) Boolean visible,
            @RequestParam(value = "featured", required = false) Boolean featured,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        Certificado c = new Certificado();
        c.setTitle(title);
        c.setIssuer(issuer);
        c.setIssuedDate(issuedDate);
        c.setCredentialUrl(credentialUrl);
        c.setPosicion(posicion);
        if (visible != null) {
            c.setVisible(visible);
        }
        if (featured != null) {
            c.setFeatured(featured);
        }
        Certificado updated = service.update(id, c, file);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
