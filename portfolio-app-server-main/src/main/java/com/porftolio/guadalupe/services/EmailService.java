package com.porftolio.guadalupe.services;

import com.porftolio.guadalupe.models.ContactaConmigo;

public interface EmailService {
    void sendContactNotification(ContactaConmigo message);
}
