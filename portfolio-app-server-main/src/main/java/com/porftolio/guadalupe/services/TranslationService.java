package com.porftolio.guadalupe.services;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {

    private static final String LIBRETRANSLATE_URL = "https://libretranslate.com/translate";
    private final RestTemplate restTemplate;

    public TranslationService(RestTemplateBuilder builder) {
        // Configurar timeout de 5 segundos (más corto)
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }

    /**
     * Traduce texto de español a inglés usando LibreTranslate API
     * @param spanishText Texto en español
     * @return Texto traducido al inglés, o el original si falla
     */
    public String translateToEnglish(String spanishText) {
        if (spanishText == null || spanishText.trim().isEmpty()) {
            return "";
        }

        System.out.println("=== INICIANDO TRADUCCIÓN ===");
        System.out.println("Texto original: " + spanishText);
        long startTime = System.currentTimeMillis();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("q", spanishText);
            requestBody.put("source", "es");
            requestBody.put("target", "en");
            requestBody.put("format", "text");

            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            System.out.println("Llamando a LibreTranslate API...");
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    LIBRETRANSLATE_URL,
                    request,
                    Map.class
            );

            long duration = System.currentTimeMillis() - startTime;
            System.out.println("Respuesta recibida en " + duration + "ms");
            System.out.println("Status: " + response.getStatusCode());
            System.out.println("Body: " + response.getBody());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Object translatedText = response.getBody().get("translatedText");
                if (translatedText != null) {
                    String result = translatedText.toString();
                    System.out.println("Texto traducido: " + result);
                    System.out.println("=== TRADUCCIÓN EXITOSA ===");
                    return result;
                }
            }

            // Si falla, devuelve el texto original
            System.err.println("Traducción falló, usando texto original");
            System.out.println("=== TRADUCCIÓN FALLIDA ===");
            return spanishText;

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            System.err.println("Error traduciendo texto después de " + duration + "ms: " + e.getMessage());
            e.printStackTrace();
            System.out.println("=== ERROR EN TRADUCCIÓN ===");
            // Si hay error, devuelve el texto original
            return spanishText;
        }
    }
}
