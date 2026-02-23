package com.revy.api.admin.server.api.user.usecase.impl;

import com.revy.api.admin.server.api.user.payload.UserPayload;
import com.revy.api.admin.server.api.user.usecase.UserUseCase;
import com.revy.application.facade.user.UserProcessor;
import com.revy.application.facade.user.UserReader;
import com.revy.application.facade.user.dto.UserReaderDto;
import com.revy.common.web.api.response.ApiPageResponse;
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
    public ApiPageResponse<UserPayload.Res> getPage(int page, int size, String sortBy, String sortDirection,
                                                    String paramQuery) {
        UserReaderDto.UserPage result = userReader.getPage(page, size, sortBy, sortDirection, paramQuery);

        return ApiPageResponse.of(result.content().stream().map(this::toResponse).toList(), result.totalElements(),
                                  result.page(), result.size());
    }

    private UserPayload.Res toResponse(UserReaderDto.UserView view) {
        return new UserPayload.Res(view.id().toString(), view.email(), null, null, null, null, null, 0, view.enabled()

        );
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
