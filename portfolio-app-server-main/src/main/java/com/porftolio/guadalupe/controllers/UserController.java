package com.porftolio.guadalupe.controllers;

import com.porftolio.guadalupe.models.User;
import com.porftolio.guadalupe.repositories.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PutMapping("/users/me/password")
    public ResponseEntity<?> changeOwnPassword(Authentication auth, @RequestBody ChangePasswordRequest body) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        Optional<User> opt = userRepository.findByUsername(auth.getName());
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        User user = opt.get();
        if (body.getCurrentPassword() == null || body.getNewPassword() == null) {
            return ResponseEntity.badRequest().body("currentPassword and newPassword are required");
        }
        if (!passwordEncoder.matches(body.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(400).body("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(body.getNewPassword()));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/users/{username}/password")
    public ResponseEntity<?> adminResetPassword(@PathVariable String username, @RequestBody AdminResetPasswordRequest body) {
        Optional<User> opt = userRepository.findByUsername(username);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        if (body.getNewPassword() == null) {
            return ResponseEntity.badRequest().body("newPassword is required");
        }
        User user = opt.get();
        user.setPassword(passwordEncoder.encode(body.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }

    @Data
    public static class AdminResetPasswordRequest {
        private String newPassword;
    }
}
