package com.porftolio.guadalupe.controllers;

import com.porftolio.guadalupe.config.ApplicationProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HealthController {

    private final ApplicationProperties applicationProperties;

    /**
     * Health check for uptime monitors; avoids hard-coded product strings in code.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", applicationProperties.getDisplayName()
        ));
    }

    /**
     * Simple ping endpoint for UptimeRobot
     * Returns minimal response for monitoring
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
