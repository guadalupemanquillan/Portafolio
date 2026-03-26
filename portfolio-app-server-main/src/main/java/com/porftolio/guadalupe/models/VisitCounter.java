package com.porftolio.guadalupe.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "VisitCounter")
public class VisitCounter {
    
    @Id
    private String id;

    private Long totalVisits;

    private LocalDateTime lastVisit;

    private LocalDateTime createdAt;
}
