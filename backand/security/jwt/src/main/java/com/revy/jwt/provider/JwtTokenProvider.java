package com.revy.jwt.provider;


import java.time.temporal.Temporal;

public interface JwtTokenProvider {

    boolean validateToken(String token);

    String createRefreshToken(String userId);

    String getUserId(String token);

    Temporal getExpiration(String refreshToken);
}
