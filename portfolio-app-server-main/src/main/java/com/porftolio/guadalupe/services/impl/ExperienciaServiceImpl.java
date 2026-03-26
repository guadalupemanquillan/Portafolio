package com.porftolio.guadalupe.services.impl;

import com.porftolio.guadalupe.models.Experiencia;
import com.porftolio.guadalupe.repositories.ExperienciaRepository;
import com.porftolio.guadalupe.services.ExperienciaService;
import com.porftolio.guadalupe.services.TranslationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ExperienciaServiceImpl implements ExperienciaService {

    private final ExperienciaRepository repository;
    private final TranslationService translationService;

    public ExperienciaServiceImpl(ExperienciaRepository repository, TranslationService translationService) {
        this.repository = repository;
        this.translationService = translationService;
    }

    @Override
    public Page<Experiencia> list(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Optional<Experiencia> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public Experiencia create(Experiencia experiencia) {
        Experiencia normalized = normalizeAndValidate(experiencia);
        autoTranslateIfNeeded(normalized);
        return repository.save(normalized);
    }

    @Override
    public Experiencia update(String id, Experiencia experiencia) {
        Experiencia current = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Experiencia not found: " + id));
        experiencia.setId(id);
        Experiencia normalized = normalizeAndValidate(experiencia);
        autoTranslateIfNeeded(normalized);
        return repository.save(normalized);
    }

    @Override
    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Experiencia not found: " + id);
        }
        repository.deleteById(id);
    }

    private Experiencia normalizeAndValidate(Experiencia e) {
        if (e == null) throw new IllegalArgumentException("Experiencia is null");
        if (e.getTrabajoActivo() != null && e.getTrabajoActivo()) {
            e.setMesFin(null);
            e.setAnoFin(null);
        } else {
            if (e.getMesFin() == null || e.getMesFin().isBlank()) {
                throw new IllegalArgumentException("mesFin is required when trabajoActivo is false");
            }
            if (e.getAnoFin() == null) {
                throw new IllegalArgumentException("anoFin is required when trabajoActivo is false");
            }

            // Temporal consistency: end date must not be before start date
            if (e.getAnoInicio() != null && e.getAnoFin() != null) {
                if (e.getAnoFin() < e.getAnoInicio()) {
                    throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio (año)");
                }
                if (e.getAnoFin().equals(e.getAnoInicio())) {
                    // Compare months when same year
                    int startMonth = monthIndex(e.getMesInicio());
                    int endMonth = monthIndex(e.getMesFin());
                    if (startMonth == -1 || endMonth == -1) {
                        throw new IllegalArgumentException("Mes de inicio/fin no válido");
                    }
                    if (endMonth < startMonth) {
                        throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio (mes)");
                    }
                }
            }
        }
        return e;
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
    private void autoTranslateIfNeeded(Experiencia e) {
        // Traducción automática deshabilitada - API pública muy lenta
        // El usuario debe ingresar manualmente el texto en inglés si lo desea
        
        // Si los campos en inglés están vacíos, usar el texto en español como fallback
        if (e.getPuestoEn() == null || e.getPuestoEn().trim().isEmpty()) {
            e.setPuestoEn(e.getPuesto());
        }
        if (e.getDescripcionEn() == null || e.getDescripcionEn().trim().isEmpty()) {
            e.setDescripcionEn(e.getDescripcion());
        }
        
        /* Código de traducción automática (deshabilitado por lentitud):
        if (e.getPuestoEn() == null || e.getPuestoEn().trim().isEmpty()) {
            e.setPuestoEn(translationService.translateToEnglish(e.getPuesto()));
        }
        if (e.getDescripcionEn() == null || e.getDescripcionEn().trim().isEmpty()) {
            e.setDescripcionEn(translationService.translateToEnglish(e.getDescripcion()));
        }
        */
    }
}
