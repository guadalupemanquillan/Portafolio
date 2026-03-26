package com.porftolio.guadalupe.repositories;

import com.porftolio.guadalupe.models.Proyecto;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProyectoRepository extends MongoRepository<Proyecto, String> {
}
