package com.porftolio.guadalupe.config;

import com.porftolio.guadalupe.services.impl.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final CustomUserDetailsService userDetailsService;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource)
            throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
            )
            .authorizeHttpRequests(auth -> auth
                // Public static assets (skill icons, etc.) - MUST be first to avoid conflicts
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/experiencias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/formaciones/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/habilidades/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/certificados/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/proyectos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/visits/increment").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/visits/count").permitAll()
                // Health check and monitoring endpoints
                .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/ping").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact/**").permitAll()
                // User self-service endpoints
                .requestMatchers(HttpMethod.PUT, "/api/users/me/password").authenticated()
                // Admin endpoints - require ADMIN role
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/experiencias/**").hasRole("ADMIN")
                .requestMatchers("/api/formaciones/**").hasRole("ADMIN")
                .requestMatchers("/api/habilidades/**").hasRole("ADMIN")
                .requestMatchers("/api/certificados/**").hasRole("ADMIN")
                .requestMatchers("/api/proyectos/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .authenticationProvider(authenticationProvider());
        
        return http.build();
    }
}
