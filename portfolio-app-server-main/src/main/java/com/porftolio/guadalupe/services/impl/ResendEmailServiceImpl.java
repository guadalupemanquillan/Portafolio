package com.porftolio.guadalupe.services.impl;

import com.porftolio.guadalupe.config.ApplicationProperties;
import com.porftolio.guadalupe.models.ContactaConmigo;
import com.porftolio.guadalupe.services.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.HtmlUtils;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.time.format.DateTimeFormatter;

@Service
public class ResendEmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(ResendEmailServiceImpl.class);
    
    private final WebClient webClient;
    private final ApplicationProperties applicationProperties;
    
    @Value("${resend.api.key}")
    private String resendApiKey;
    
    @Value("${resend.from.email:onboarding@resend.dev}")
    private String fromEmail;
    
    @Value("${resend.to.email:trabajoguada@gmail.com}")
    private String toEmail;

    public ResendEmailServiceImpl(WebClient.Builder webClientBuilder, ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
        this.webClient = webClientBuilder
                .baseUrl("https://api.resend.com")
                .build();
    }

    @Override
    public void sendContactNotification(ContactaConmigo message) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            logger.warn("Resend desactivado: definí RESEND_API_KEY para enviar correos de contacto.");
            return;
        }
        try {
            Map<String, Object> emailRequest = Map.of(
                "from", fromEmail,
                "to", new String[]{toEmail},
                "subject", "Nuevo mensaje de contacto: " + message.getAsunto(),
                "html", buildEmailHtml(message)
            );

            logger.info("Sending contact notification email (Resend)");
            
            webClient.post()
                    .uri("/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + resendApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(emailRequest)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnSuccess(response -> logger.info("Email sent successfully: {}", response))
                    .doOnError(error -> logger.error("Failed to send email", error))
                    .onErrorResume(error -> {
                        logger.warn("Email sending failed, but continuing: {}", error.getMessage());
                        return Mono.empty();
                    })
                    .subscribe();
                    
        } catch (Exception e) {
            logger.error("Error sending email notification", e);
        }
    }

    private String buildEmailHtml(ContactaConmigo message) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String dateStr = message.getCreatedAt() != null ? message.getCreatedAt().format(fmt) : "";
        String safeMsg = message.getMensaje()
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\n", "<br>");
        String branding = HtmlUtils.htmlEscape(applicationProperties.getDisplayName());

        return String.format("""
            <div style=\"max-width:640px;margin:0 auto;font-family:Inter,Segoe UI,Arial,sans-serif;background:#0b0b12;color:#eae6ff;border-radius:14px;overflow:hidden;border:1px solid #2b1c3f;\">
              <div style=\"background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:20px 24px;\">
                <h1 style=\"margin:0;font-size:20px;line-height:1.2;color:#fff;\">Nuevo mensaje de contacto</h1>
                <p style=\"margin:6px 0 0 0;color:#f3e8ff;opacity:.9;font-size:12px;\">Mensaje enviado desde el formulario de contacto de %s</p>
              </div>

              <div style=\"padding:20px 24px;\">
                <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">
                  <div style=\"background:rgba(124,58,237,.12);border:1px solid #2b1c3f;border-radius:10px;padding:12px 14px;\">
                    <div style=\"font-size:12px;color:#c4b5fd;letter-spacing:.3px;text-transform:uppercase;\">De</div>
                    <div style=\"font-weight:600;color:#faf5ff;margin-top:4px;\">%s</div>
                  </div>
                  <div style=\"background:rgba(124,58,237,.12);border:1px solid #2b1c3f;border-radius:10px;padding:12px 14px;\">
                    <div style=\"font-size:12px;color:#c4b5fd;letter-spacing:.3px;text-transform:uppercase;\">Fecha</div>
                    <div style=\"font-weight:600;color:#faf5ff;margin-top:4px;\">%s</div>
                  </div>
                </div>

                <div style=\"background:rgba(168,85,247,.10);border:1px solid #2b1c3f;border-radius:12px;padding:14px 16px;margin-top:12px;\">
                  <div style=\"font-size:12px;color:#e9d5ff;letter-spacing:.3px;text-transform:uppercase;\">Asunto</div>
                  <div style=\"font-weight:700;color:#ffffff;margin-top:6px;font-size:16px;\">%s</div>
                </div>

                <div style=\"margin-top:16px;padding:16px;border:1px solid #2b1c3f;border-radius:12px;background:rgba(124,58,237,0.08);\">
                  <div style=\"font-weight:700;margin-bottom:8px;color:#e9d5ff;\">Mensaje</div>
                  <div style=\"line-height:1.7;color:#f5f3ff;font-size:14px;\">%s</div>
                </div>

                <div style=\"margin-top:18px;display:flex;align-items:center;gap:8px;color:#c4b5fd;font-size:12px;\">
                  <span style=\"display:inline-block;width:6px;height:6px;border-radius:999px;background:#a855f7;\"></span>
                  Notificación automática — %s
                </div>
              </div>
            </div>
            """,
            branding,
            HtmlUtils.htmlEscape(message.getEmail()),
            dateStr,
            HtmlUtils.htmlEscape(message.getAsunto()),
            safeMsg,
            branding
        );
    }
}
