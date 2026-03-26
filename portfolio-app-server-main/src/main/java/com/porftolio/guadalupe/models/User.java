package com.porftolio.guadalupe.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    private String password; // BCrypt hashed
    
    private String role; // ROLE_ADMIN, ROLE_USER
    
    private boolean enabled = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime lastLogin;
}
