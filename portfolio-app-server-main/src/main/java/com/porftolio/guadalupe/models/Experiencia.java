package com.porftolio.guadalupe.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Experiencia")
public class Experiencia {

    @Id
    private String id;

    @NotBlank(message = "Empresa es requerida")
    @Size(max = 100, message = "Empresa no puede exceder 100 caracteres")
    private String empresa;

    @NotBlank(message = "Puesto es requerido")
    @Size(max = 100, message = "Puesto no puede exceder 100 caracteres")
    private String puesto;

    @NotBlank(message = "Descripción es requerida")
    @Size(max = 500, message = "Descripción no puede exceder 500 caracteres")
    private String descripcion;

    // Campos en inglés (opcionales, se traducen automáticamente si están vacíos)
    @Size(max = 100, message = "Puesto en inglés no puede exceder 100 caracteres")
    private String puestoEn;

    @Size(max = 500, message = "Descripción en inglés no puede exceder 500 caracteres")
    private String descripcionEn;

    @NotBlank(message = "Mes de inicio es requerido")
    private String mesInicio;

    @NotNull(message = "Año de inicio es requerido")
    private Integer anoInicio;

    @NotNull(message = "Trabajo activo es requerido")
    private Boolean trabajoActivo;

    private String mesFin;
    private Integer anoFin;

    public Experiencia(String empresa, String puesto, String descripcion, String mesInicio, int anoInicio, boolean trabajoActivo, String mesFin, Integer anoFin){
        this.empresa = empresa;
        this.puesto = puesto;
        this.descripcion = descripcion;
        this.mesInicio = mesInicio;
        this.anoInicio = anoInicio;
        this.trabajoActivo = trabajoActivo;
        if (!trabajoActivo) {
            this.mesFin = mesFin;
            this.anoFin = anoFin;
        } else {
            this.mesFin = null;
            this.anoFin = null;
        }
    }
}
