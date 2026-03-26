package com.porftolio.guadalupe.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

/**
 * Application-wide settings loaded from {@code application.properties} / profile overrides.
 * Keeps branding and CORS in one place for easier deployment and scaling.
 */
@Data
@ConfigurationProperties(prefix = "app")
public class ApplicationProperties {

    /**
     * Shown in health checks and outbound emails (contact notifications).
     */
    private String displayName = "Guadalupe Manquillan — Portfolio API";

    /**
     * Public base URL of this API (optional; useful for links in emails or redirects).
     */
    private String baseUrl;

    /**
     * Browser CORS policy: only {@link Cors#getAllowedOrigins()} may call this API from the front-end.
     */
    private final Cors cors = new Cors();

    @Data
    public static class Cors {

        /**
         * Allowed {@code Origin} values (scheme + host + port). Configure as a comma-separated list in
         * {@code application.properties} under {@code app.cors.allowed-origins}.
         */
        private List<String> allowedOrigins = new ArrayList<>();
    }
}
