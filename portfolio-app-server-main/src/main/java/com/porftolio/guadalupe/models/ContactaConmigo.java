package com.porftolio.guadalupe.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ContactaConmigo")
public class ContactaConmigo {

    @Id
    private String id;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String asunto;

    @NotBlank
    private String mensaje;

    private LocalDateTime createdAt;

    private boolean processed;

    public ContactaConmigo(String email, String asunto, String mensaje) {
        this.email = email;
        this.asunto = asunto;
        this.mensaje = mensaje;
        this.createdAt = LocalDateTime.now();
        this.processed = false;
    }
}
