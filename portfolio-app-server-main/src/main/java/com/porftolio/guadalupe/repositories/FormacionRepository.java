package com.porftolio.guadalupe.repositories;

import com.porftolio.guadalupe.models.Formacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FormacionRepository extends MongoRepository<Formacion, String> {
    Page<Formacion> findAll(Pageable pageable);
}
