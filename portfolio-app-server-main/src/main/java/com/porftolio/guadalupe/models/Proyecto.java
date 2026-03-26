package com.porftolio.guadalupe.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Proyectos")
public class Proyecto {

    @Id
    private String id;

    @NotBlank(message = "El nombre del proyecto es obligatorio")
    @Size(max = 120, message = "El nombre no puede superar 120 caracteres")
    private String nombre;

    @NotBlank(message = "La descripcion del proyecto es obligatoria")
    @Size(max = 1500, message = "La descripcion no puede superar 1500 caracteres")
    private String descripcion;

    @Size(max = 350, message = "El enlace de GitHub no puede superar 350 caracteres")
    private String enlaceGithub;

    @Size(max = 350, message = "El enlace de despliegue no puede superar 350 caracteres")
    private String enlaceDespliegue;

    private List<String> tecnologias = new ArrayList<>();

    private Integer posicion;

    /**
     * Relative path used by frontend, e.g. "proyectos/mi-imagen.png"
     */
    private String imagen;
}
