package com.revy.application.facade.user.impl;

import com.revy.application.facade.user.UserProcessor;
import com.revy.application.facade.user.UserReader;
import com.revy.application.facade.user.dto.SignupUserDto;
import com.revy.application.facade.user.dto.UserReaderDto;
import com.revy.application.facade.user.dto.UserTokenDto;
import com.revy.common.domain.enums.user.UserStatus;
import com.revy.domain.user.User;
import com.revy.domain.user.repository.UserRepository;
import com.revy.jwt.provider.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProcessorImpl implements UserProcessor {
    private final UserReader userReader;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public SignupUserDto.Result signup(String email, String rawPassword, String firstName, String lastName,
                                      String nickName) {
        Optional<UserReaderDto.AuthUser> oldUser = userReader.getAuthUserByEmail(email);

        if(oldUser.isPresent()){
            throw new IllegalArgumentException("존재하는 계정입니다.");
        }

        var siginUser = User.createUser(
                email,
                passwordEncoder.encode(rawPassword)
                ,firstName, lastName,nickName
        );
        siginUser = userRepository.save(siginUser);

        return new SignupUserDto.Result(siginUser.getId().toString());
    }

    @Override
    public UserTokenDto.Result login(String email, String rawPassword) {
        UserReaderDto.AuthUser user = userReader.getAuthUserByEmail(email)
                                                 .orElseThrow(
                                                         () -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!user.enabled() || user.status() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("비활성화된 계정입니다.");
        }
        if (!passwordEncoder.matches(rawPassword, user.encodedPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        return issueToken(user.id().toString());
    }

    @Override
    public UserTokenDto.Result reissue(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }
        String id = jwtTokenProvider.getUserId(refreshToken);
        UUID userId;
        try {
            userId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        UserReaderDto.AuthUser user = userReader.getByAuthUserId(userId)
                                                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (!user.enabled() || user.status() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("비활성화된 계정입니다.");
        }
        return issueToken(user.id().toString());
    }

    private UserTokenDto.Result issueToken(String userId) {
        String accessToken = jwtTokenProvider.createAccessToken(userId);
        String refreshToken = jwtTokenProvider.createRefreshToken(userId);
        return new UserTokenDto.Result("Bearer", accessToken, refreshToken);
    }
}
