package com.porftolio.guadalupe.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean authenticated;
    private String username;
    private String role;
    private String message;
    
    public static AuthResponse success(String username, String role) {
        return new AuthResponse(true, username, role, "Authentication successful");
    }
    
    public static AuthResponse failure(String message) {
        return new AuthResponse(false, null, null, message);
    }
    
    public static AuthResponse unauthenticated() {
        return new AuthResponse(false, null, null, "Not authenticated");
    }
}
