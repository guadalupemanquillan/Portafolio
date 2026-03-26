package com.porftolio.guadalupe.repositories;

import com.porftolio.guadalupe.models.VisitCounter;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VisitCounterRepository extends MongoRepository<VisitCounter, String> {
}
