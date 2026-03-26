package com.porftolio.guadalupe.services;

import com.porftolio.guadalupe.models.VisitCounter;
import com.porftolio.guadalupe.repositories.VisitCounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VisitCounterService {
    
    @Autowired
    private VisitCounterRepository visitCounterRepository;
    
    /**
     * Incrementa el contador de visitas. Crea el documento si no existe.
     */
    public VisitCounter incrementVisit() {
        final String COUNTER_ID = "global-counter";
        Optional<VisitCounter> counterOpt = visitCounterRepository.findById(COUNTER_ID);

        VisitCounter counter;
        if (counterOpt.isPresent()) {
            counter = counterOpt.get();
            counter.setTotalVisits(counter.getTotalVisits() + 1);
            counter.setLastVisit(LocalDateTime.now());
        } else {
            counter = new VisitCounter();
            counter.setId(COUNTER_ID);
            counter.setTotalVisits(1L);
            counter.setLastVisit(LocalDateTime.now());
            counter.setCreatedAt(LocalDateTime.now());
        }

        return visitCounterRepository.save(counter);
    }
    
    /**
     * Obtiene el contador actual sin incrementarlo.
     */
    public VisitCounter getVisitCount() {
        final String COUNTER_ID = "global-counter";
        return visitCounterRepository.findById(COUNTER_ID)
            .orElseGet(() -> {
                VisitCounter counter = new VisitCounter();
                counter.setId(COUNTER_ID);
                counter.setTotalVisits(0L);
                counter.setLastVisit(LocalDateTime.now());
                counter.setCreatedAt(LocalDateTime.now());
                return visitCounterRepository.save(counter);
            });
    }
}
