package com.acadmap.security.dto;

import java.util.UUID;

public record TokenDTO(String accessToken, UUID refreshTokenUUID) {
}
