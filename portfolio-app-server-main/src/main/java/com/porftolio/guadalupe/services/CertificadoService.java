package com.porftolio.guadalupe.services;

import com.porftolio.guadalupe.models.Certificado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface CertificadoService {

    Certificado create(Certificado certificado, MultipartFile file) throws IOException;

    Certificado update(String id, Certificado certificado, MultipartFile file) throws IOException;

    void delete(String id);

    Optional<Certificado> findById(String id);

    Page<Certificado> listVisible(Pageable pageable);

    Page<Certificado> listAll(Pageable pageable);
}
