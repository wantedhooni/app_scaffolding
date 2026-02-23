package com.revy.application.facade.user;

import com.revy.application.facade.user.dto.UserReaderDto;

import java.util.Optional;
import java.util.UUID;

public interface UserReader {
    Optional<UserReaderDto.AuthUser> getByAuthUserId(UUID userId);

    Optional<UserReaderDto.AuthUser> getAuthUserByEmail(String email);

    boolean hasAnySecurityData();
}
