package com.revy.api.server.api.auth.usecase.impl;


import com.revy.api.server.api.auth.payload.LoginPayload;
import com.revy.api.server.api.auth.payload.SignupPayload;
import com.revy.api.server.api.auth.payload.TokenReissuePayload;
import com.revy.api.server.api.auth.usecase.AuthUseCase;
import com.revy.application.facade.user.UserProcessor;
import com.revy.application.facade.user.dto.UserTokenDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthUseCaseImpl  implements AuthUseCase {
    private final UserProcessor processor;

    @Override
    public SignupPayload.Res signup(SignupPayload.Req req) {
        // processor.createUser(req.email(), req.password());
        return null;
    }

    @Override
    public LoginPayload.Res login(LoginPayload.Req req) {
        UserTokenDto.Result token = processor.login(req.email(), req.password());
        return new LoginPayload.Res(token.tokenType(), token.accessToken(), token.refreshToken());
    }

    @Override
    public TokenReissuePayload.Res reissue(TokenReissuePayload.Req req) {
        UserTokenDto.Result token = processor.reissue(req.refreshToken());
        return new TokenReissuePayload.Res(token.tokenType(), token.accessToken(), token.refreshToken());
    }
}
