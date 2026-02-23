package com.revy.application.facade.user;


import com.revy.application.facade.user.dto.UserTokenDto;

public interface UserProcessor {
    UserTokenDto.Result login(String email, String password);

    UserTokenDto.Result reissue(String token);
}
