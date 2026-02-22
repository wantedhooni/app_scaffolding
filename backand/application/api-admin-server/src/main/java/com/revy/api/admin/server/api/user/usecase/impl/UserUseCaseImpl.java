package com.revy.api.admin.server.api.user.usecase.impl;

import com.revy.api.admin.server.api.user.payload.UserPayload;
import com.revy.api.admin.server.api.user.usecase.UserUseCase;
import com.revy.api.admin.server.common.PageResponse;
import com.revy.api.admin.server.facade.user.UserProcessor;
import com.revy.api.admin.server.facade.user.UserReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Component
public class UserUseCaseImpl implements UserUseCase {
    private final UserProcessor userProcessor;
    private final UserReader userReader;

    @Override
    public PageResponse<UserPayload.Res> getPage(int page, int size, String sortBy, String sortDirection,
                                                 String paramQuery) {
        return null;
        //return userProcessor.;
    }

    @Override
    public UserPayload.Res create(UserPayload.CreateReq req) {
        return null;
    }

    @Override
    public UserPayload.Res get(UUID id) {
        return null;
    }

    @Override
    public UserPayload.Res update(UUID id, UserPayload.UpdateReq req) {
        return null;
    }

    @Override
    public void delete(UUID id) {

    }
}
