package com.porftolio.guadalupe.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Certificado / diploma. El archivo vive en uploads/certificados/; en BD solo metadatos y ruta relativa.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Certificados")
public class Certificado {

    @Id
    private String id;

    @NotBlank
    private String title;

    @NotBlank
    private String issuer;

    /** Fecha ISO yyyy-MM-dd */
    @NotBlank
    private String issuedDate;

    /** Ruta bajo uploads/, ej. certificados/abc.pdf */
    @NotBlank
    private String fileUrl;

    /** Enlace público de verificación (Credly, etc.) */
    private String credentialUrl;

    /** "image" | "pdf" */
    @NotBlank
    private String mediaType;

    private Integer posicion;

    private Boolean visible = true;

    private Boolean featured = false;
}
