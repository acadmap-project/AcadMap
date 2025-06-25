package com.acadmap.exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class PersonalizedListResponse<T> {

    private String message;
    private List<T> periodicosSimilares;
    private LocalDateTime timestamp;

    public PersonalizedListResponse(String message, List<T> periodicosSimilares) {
        this.message = message;
        this.periodicosSimilares = periodicosSimilares;
        this.timestamp = LocalDateTime.now(); // seta timestamp no momento da criação
    }

}
