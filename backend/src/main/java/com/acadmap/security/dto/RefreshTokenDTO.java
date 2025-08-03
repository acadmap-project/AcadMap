package com.acadmap.security.dto;

import java.util.UUID;

public record RefreshTokenDTO(String token, UUID refreshTokenUUID) {
}
