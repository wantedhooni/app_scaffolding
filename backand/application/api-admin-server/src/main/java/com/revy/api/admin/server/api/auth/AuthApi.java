package com.revy.api.admin.server.api.auth;

import com.revy.api.admin.server.api.auth.payload.LoginPayload;
import com.revy.api.admin.server.api.auth.payload.SignupPayload;
import com.revy.api.admin.server.api.auth.payload.TokenReissuePayload;
import com.revy.api.admin.server.api.auth.usecase.AuthUseCase;
import com.revy.api.admin.server.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증 API", description = "회원가입/로그인/토큰 재발급")
public class AuthApi {

    private final AuthUseCase authUseCase;

    @Valid
    @Operation(summary = "회원가입", description = "이메일 기반 회원가입을 진행한다.")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupPayload.Res>> signup(SignupPayload.Req req) {
        return ResponseEntity.ok(ApiResponse.ok(new SignupPayload.Res("회원가입이 완료되었습니다.")));
    }

    @Operation(summary = "로그인", description = "로그인 후 액세스/리프레시 토큰을 발급한다.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginPayload.Res>> login(LoginPayload.Req req){
        return ResponseEntity.ok(ApiResponse.ok(new LoginPayload.Res("tokenType", "액세스 토큰", "리프레시 토큰")));
    }

    @Operation(summary = "토큰 재발급")
    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<TokenReissuePayload.Res>> reissue(TokenReissuePayload.Req req){
        return ResponseEntity.ok(ApiResponse.ok(new TokenReissuePayload.Res("tokenType", "액세스 토큰", "리프레시 토큰")));
    }
}
