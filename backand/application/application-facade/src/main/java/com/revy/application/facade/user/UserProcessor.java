package com.revy.application.facade.user;


import com.revy.application.facade.user.dto.SignupUserDto;

public interface UserProcessor {
    SignupUserDto.Result signup(String email, String rawPassword, String firstName, String lastName, String nickName);
}
