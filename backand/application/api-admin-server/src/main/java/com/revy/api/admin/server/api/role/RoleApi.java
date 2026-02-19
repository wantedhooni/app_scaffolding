package com.revy.api.admin.server.api.role;

import com.revy.api.admin.server.api.role.payload.RolePayload;
import com.revy.api.admin.server.api.role.usecase.RoleUseCase;
import com.revy.api.admin.server.common.ApiResponse;
import com.revy.api.admin.server.common.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
@Tag(name = "역할 관리 API", description = "역할 CRUD")
public class RoleApi {
    private final RoleUseCase roleUseCase;

    @Operation(summary = "역할 생성 커맨드", description = "")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<RolePayload.Res>> create(@Valid @RequestBody RolePayload.CreateCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(roleUseCase.create(req)));
    }

    @Operation(summary = "역할 단건 조회", description = "")
    @GetMapping("/{roleId}")
    public ResponseEntity<ApiResponse<RolePayload.Res>> get(@PathVariable UUID roleId) {
        return ResponseEntity.ok(ApiResponse.ok(roleUseCase.get(roleId)));
    }

    @Operation(summary = "역할 목록 조회", description = "")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<RolePayload.Res>>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(roleUseCase.getPage(page, size)));
    }

    @Operation(summary = "역할 수정 커맨드", description = "")
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<RolePayload.Res>> update(@Valid @RequestBody RolePayload.UpdateCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(roleUseCase.update(req)));
    }

    @Operation(summary = "역할 삭제 커맨드", description = "")
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<RolePayload.DeleteRes>> delete(@Valid @RequestBody RolePayload.DeleteCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(roleUseCase.delete(req)));
    }

    @Operation(summary = "역할에 사용자 추가 커맨드", description = "")
    @PostMapping("/add-admin")
    public ResponseEntity<ApiResponse<RolePayload.Res>> addAdmin(@Valid @RequestBody RolePayload.AddAdminCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(roleUseCase.addAdmin(req)));
    }
}
