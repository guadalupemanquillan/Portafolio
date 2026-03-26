package com.porftolio.guadalupe.controllers;

import com.porftolio.guadalupe.models.AuthResponse;
import com.porftolio.guadalupe.models.LoginRequest;
import com.porftolio.guadalupe.models.User;
import com.porftolio.guadalupe.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {
        
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            // Set authentication in security context
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);
            
            // Create session
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
            session.setMaxInactiveInterval(900); // 15 minutes
            
            // Update last login
            userRepository.findByUsername(loginRequest.getUsername())
                .ifPresent(user -> {
                    user.setLastLogin(LocalDateTime.now());
                    userRepository.save(user);
                });
            
            // Get role
            String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");
            
            log.info("User {} logged in successfully with role {}", loginRequest.getUsername(), role);
            
            return ResponseEntity.ok(AuthResponse.success(loginRequest.getUsername(), role));
            
        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthResponse.failure("Invalid username or password"));
        } catch (Exception e) {
            log.error("Login error for user {}: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.failure("An error occurred during login"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                String username = SecurityContextHolder.getContext().getAuthentication().getName();
                session.invalidate();
                SecurityContextHolder.clearContext();
                log.info("User {} logged out successfully", username);
            }
            return ResponseEntity.ok(AuthResponse.success(null, null));
        } catch (Exception e) {
            log.error("Logout error: {}", e.getMessage());
            return ResponseEntity.ok(AuthResponse.success(null, null));
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<AuthResponse> getStatus() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                "anonymousUser".equals(authentication.getPrincipal())) {
                return ResponseEntity.ok(AuthResponse.unauthenticated());
            }
            
            String username = authentication.getName();
            String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");
            
            return ResponseEntity.ok(AuthResponse.success(username, role));
            
        } catch (Exception e) {
            log.error("Status check error: {}", e.getMessage());
            return ResponseEntity.ok(AuthResponse.unauthenticated());
        }
    }
}
