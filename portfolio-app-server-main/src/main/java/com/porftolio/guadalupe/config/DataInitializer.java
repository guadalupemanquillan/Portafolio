package com.porftolio.guadalupe.config;

import com.porftolio.guadalupe.models.User;
import com.porftolio.guadalupe.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default admin user on first run (only if none exists). Credentials should be rotated in production.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // Change this password!
            admin.setRole("ROLE_ADMIN");
            admin.setEnabled(true);
            
            userRepository.save(admin);
            log.info("Default admin user created. Username: admin, Password: admin123");
            log.warn("IMPORTANT: Change the default admin password immediately!");
        }
    }
}
