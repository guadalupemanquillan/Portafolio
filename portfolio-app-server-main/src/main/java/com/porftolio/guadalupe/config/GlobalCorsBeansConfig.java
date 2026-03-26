package com.porftolio.guadalupe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Registers CORS for the whole API. Origins come from configuration ({@code app.cors.*}), not from
 * per-controller annotations, so new endpoints inherit the same policy automatically.
 */
@Configuration
public class GlobalCorsBeansConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource(ApplicationProperties applicationProperties) {
        List<String> origins = applicationProperties.getCors().getAllowedOrigins();
        if (origins == null || origins.isEmpty()) {
            throw new IllegalStateException(
                    "Missing app.cors.allowed-origins: add a comma-separated list in application.properties");
        }

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
