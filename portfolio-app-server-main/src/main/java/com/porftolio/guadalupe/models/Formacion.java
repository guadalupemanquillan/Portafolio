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
@Document(collection = "Formacion")
public class Formacion {

    @Id
    private String id;

    @NotBlank(message = "Nombre es requerido")
    @Size(max = 150, message = "Nombre no puede exceder 150 caracteres")
    private String nombre;

    @NotBlank(message = "Centro es requerido")
    @Size(max = 150, message = "Centro no puede exceder 150 caracteres")
    private String centro;

    // Campos en inglés (opcionales, se traducen automáticamente si están vacíos)
    @Size(max = 150, message = "Nombre en inglés no puede exceder 150 caracteres")
    private String nombreEn;

    @NotBlank(message = "Mes de inicio es requerido")
    private String mesInicio;

    @NotNull(message = "Año de inicio es requerido")
    private Integer anoInicio;

    @NotNull(message = "Cursando ahora es requerido")
    private Boolean cursandoAhora;

    private String mesFin;
    private Integer anoFin;

    public Formacion(String nombre, String centro, String mesInicio, int anoInicio, boolean cursandoAhora, String mesFin, Integer anoFin){
        this.nombre = nombre;
        this.centro = centro;
        this.mesInicio = mesInicio;
        this.anoInicio = anoInicio;
        this.cursandoAhora = cursandoAhora;
        if (!cursandoAhora) {
            this.mesFin = mesFin;
            this.anoFin = anoFin;
        } else {
            this.mesFin = null;
            this.anoFin = null;
        }
    }
}
