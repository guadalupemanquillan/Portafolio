package com.porftolio.guadalupe.services.impl;

import com.porftolio.guadalupe.models.Formacion;
import com.porftolio.guadalupe.repositories.FormacionRepository;
import com.porftolio.guadalupe.services.FormacionService;
import com.porftolio.guadalupe.services.TranslationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class FormacionServiceImpl implements FormacionService {

    private final FormacionRepository repository;
    private final TranslationService translationService;

    public FormacionServiceImpl(FormacionRepository repository, TranslationService translationService) {
        this.repository = repository;
        this.translationService = translationService;
    }

    @Override
    public Page<Formacion> list(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Optional<Formacion> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public Formacion create(Formacion formacion) {
        Formacion normalized = normalizeAndValidate(formacion);
        autoTranslateIfNeeded(normalized);
        return repository.save(normalized);
    }

    @Override
    public Formacion update(String id, Formacion formacion) {
        Formacion current = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Formacion not found: " + id));
        formacion.setId(id);
        Formacion normalized = normalizeAndValidate(formacion);
        autoTranslateIfNeeded(normalized);
        return repository.save(normalized);
    }

    @Override
    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Formacion not found: " + id);
        }
        repository.deleteById(id);
    }

    private Formacion normalizeAndValidate(Formacion f) {
        if (f == null) throw new IllegalArgumentException("Formacion is null");
        if (f.getCursandoAhora() != null && f.getCursandoAhora()) {
            f.setMesFin(null);
            f.setAnoFin(null);
        } else {
            if (f.getMesFin() == null || f.getMesFin().isBlank()) {
                throw new IllegalArgumentException("mesFin is required when cursandoAhora is false");
            }
            if (f.getAnoFin() == null) {
                throw new IllegalArgumentException("anoFin is required when cursandoAhora is false");
            }

            // Temporal consistency: end date must not be before start date
            if (f.getAnoInicio() != null && f.getAnoFin() != null) {
                if (f.getAnoFin() < f.getAnoInicio()) {
                    throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio (año)");
                }
                if (f.getAnoFin().equals(f.getAnoInicio())) {
                    int startMonth = monthIndex(f.getMesInicio());
                    int endMonth = monthIndex(f.getMesFin());
                    if (startMonth == -1 || endMonth == -1) {
                        throw new IllegalArgumentException("Mes de inicio/fin no válido");
                    }
                    if (endMonth < startMonth) {
                        throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio (mes)");
                    }
                }
            }
        }
        return f;
    }

    private int monthIndex(String mes) {
        if (mes == null) return -1;
        String m = mes.trim().toLowerCase();
        switch (m) {
            case "enero": return 1;
            case "febrero": return 2;
            case "marzo": return 3;
            case "abril": return 4;
            case "mayo": return 5;
            case "junio": return 6;
            case "julio": return 7;
            case "agosto": return 8;
            case "septiembre": return 9;
            case "octubre": return 10;
            case "noviembre": return 11;
            case "diciembre": return 12;
            default: return -1;
        }
    }

    /**
     * Auto-traduce campos al inglés si están vacíos
     * NOTA: Traducción deshabilitada temporalmente por lentitud de API pública
     */
    private void autoTranslateIfNeeded(Formacion f) {
        // Traducción automática deshabilitada - API pública muy lenta
        // El usuario debe ingresar manualmente el texto en inglés si lo desea
        
        // Si el campo en inglés está vacío, usar el texto en español como fallback
        if (f.getNombreEn() == null || f.getNombreEn().trim().isEmpty()) {
            f.setNombreEn(f.getNombre());
        }
        
        /* Código de traducción automática (deshabilitado por lentitud):
        if (f.getNombreEn() == null || f.getNombreEn().trim().isEmpty()) {
            f.setNombreEn(translationService.translateToEnglish(f.getNombre()));
        }
        */
    }
}
