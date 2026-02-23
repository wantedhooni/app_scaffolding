package com.revy.application.facade.user.dto;

import com.revy.common.domain.enums.user.UserStatus;

import java.util.Set;
import java.util.UUID;

public class UserReaderDto {

    public record AuthUser(
            UUID id,
            String email,
            String encodedPassword,
            UserStatus status,
            boolean enabled,
            Set<String> roleNames
    ){

    }
}
