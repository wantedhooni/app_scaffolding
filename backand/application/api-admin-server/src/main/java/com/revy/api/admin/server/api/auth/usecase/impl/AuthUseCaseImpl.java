package com.revy.api.admin.server.api.auth.usecase.impl;

import com.revy.api.admin.server.api.auth.payload.LoginPayload;
import com.revy.api.admin.server.api.auth.payload.SignupPayload;
import com.revy.api.admin.server.api.auth.payload.TokenReissuePayload;
import com.revy.api.admin.server.api.auth.usecase.AuthUseCase;
import com.revy.application.facade.administrator.admin.AdminProcessor;
import com.revy.application.facade.administrator.admin.dto.AdminTokenDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthUseCaseImpl  implements AuthUseCase {
    private final AdminProcessor adminProcessor;

    @Override
    public void createAdmin(SignupPayload.Req req) {
        adminProcessor.createAdmin(req.email(), req.password());
    }

    @Override
    public LoginPayload.Res login(LoginPayload.Req req) {
        AdminTokenDto.Result token = adminProcessor.login(req.email(), req.password());
        return new LoginPayload.Res(token.tokenType(), token.accessToken(), token.refreshToken());
    }

    @Override
    public TokenReissuePayload.Res reissue(TokenReissuePayload.Req req) {
        AdminTokenDto.Result token = adminProcessor.reissue(req.refreshToken());
        return new TokenReissuePayload.Res(token.tokenType(), token.accessToken(), token.refreshToken());
    }
}
