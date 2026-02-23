package com.revy.application.facade.user;


import com.revy.application.facade.user.dto.SignupUserDto;
import com.revy.application.facade.user.dto.UserTokenDto;

public interface UserProcessor {
    SignupUserDto.Result signup(String email, String rawPassword, String firstName, String lastName, String nickName);
    UserTokenDto.Result login(String email, String password);

    UserTokenDto.Result reissue(String token);
}
