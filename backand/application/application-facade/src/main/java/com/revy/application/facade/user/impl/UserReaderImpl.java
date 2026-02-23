package com.revy.application.facade.user.impl;


import com.revy.application.facade.user.UserReader;
import com.revy.application.facade.user.dto.UserReaderDto;
import com.revy.domain.user.QUser;
import com.revy.domain.user.User;
import com.revy.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserReaderImpl implements UserReader {

    private final UserRepository userRepository;

    @Override
    public Optional<UserReaderDto.AuthUser> getByAuthUserId(UUID userId) {
        return userRepository.findOne(QUser.user.id.eq(userId)).map(this::toAuthUser);
    }

    @Override
    public Optional<UserReaderDto.AuthUser> getAuthUserByEmail(String email) {
        return userRepository.findOne(QUser.user.email.eq(email)).map(this::toAuthUser);
    }

    @Override
    public boolean hasAnySecurityData() {
        return  userRepository.findAll(QUser.user.id.isNotNull(), PageRequest.of(1, 1)).getTotalElements() > 0;
    }

    private UserReaderDto.AuthUser toAuthUser(User user) {
        Set<String> roleNames = user.getPermissions().stream().map(Enum::name).collect(Collectors.toSet());

        return new UserReaderDto.AuthUser(user.getId(), user.getEmail(), user.getPassword(), user.getStatus(),
                                          user.isEnabled(), roleNames);
    }
}
