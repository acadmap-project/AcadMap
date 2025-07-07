package com.acadmap.exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@NoArgsConstructor
@Getter
@Setter
public class PersonalizedResponse<R> {
    private String message;
    private R dto;
    private LocalDateTime timestamp;

    public PersonalizedResponse(String message, R dto){
        this.message = message;
        this.dto = dto;
        this.timestamp = LocalDateTime.now();
    }

}
