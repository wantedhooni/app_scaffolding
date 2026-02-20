package com.revy.api.admin.server.api.administrator.admin;

import com.revy.api.admin.server.api.administrator.admin.payload.AdminPayload;
import com.revy.api.admin.server.api.administrator.admin.usecase.AdminUseCase;
import com.revy.api.admin.server.common.PageResponse;
import com.revy.api.admin.server.common.controller.CrudController;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "사용자 관리 API", description = "사용자 CRUD")
public class AdminApi extends CrudController<AdminPayload.CreateReq, AdminPayload.UpdateCommandReq, AdminPayload.Res> {
    private final AdminUseCase adminUseCase;


    @Override
    protected PageResponse<AdminPayload.Res> getPage(int page, int size, String sortBy, String sortDirection,
                                                     String paramQuery) {
        return adminUseCase.getPage(page, size, paramQuery);
    }

    @Override
    protected AdminPayload.Res doCreate(AdminPayload.CreateReq req) {
        return adminUseCase.create(req);
    }

    @Override
    protected AdminPayload.Res doGet(UUID id) {
        return adminUseCase.get(id);
    }

    @Override
    protected AdminPayload.Res doUpdate(UUID id, AdminPayload.UpdateCommandReq req) {
        return adminUseCase.update(id, req);
    }

    @Override
    protected void doDelete(UUID id) {
        adminUseCase.delete(id);
    }
}
