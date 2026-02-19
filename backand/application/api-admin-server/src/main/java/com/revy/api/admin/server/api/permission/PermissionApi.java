package com.revy.api.admin.server.api.permission;

import com.revy.api.admin.server.api.permission.payload.PermissionPayload;
import com.revy.api.admin.server.api.permission.usecase.PermissionUseCase;
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
@RequestMapping("/api/permission")
@RequiredArgsConstructor
@Tag(name = "권한 관리 API", description = "권한 CRUD")
public class PermissionApi {
    private final PermissionUseCase permissionUseCase;

    @Operation(summary = "권한 생성 커맨드", description = "")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PermissionPayload.Res>> create(@Valid @RequestBody PermissionPayload.CreateCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(permissionUseCase.create(req)));
    }

    @Operation(summary = "권한 단건 조회", description = "")
    @GetMapping("/{permissionId}")
    public ResponseEntity<ApiResponse<PermissionPayload.Res>> get(@PathVariable UUID permissionId) {
        return ResponseEntity.ok(ApiResponse.ok(permissionUseCase.get(permissionId)));
    }

    @Operation(summary = "권한 목록 조회", description = "")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PermissionPayload.Res>>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(permissionUseCase.getPage(page, size)));
    }

    @Operation(summary = "권한 수정 커맨드", description = "")
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<PermissionPayload.Res>> update(@Valid @RequestBody PermissionPayload.UpdateCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(permissionUseCase.update(req)));
    }

    @Operation(summary = "권한 삭제 커맨드", description = "")
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<PermissionPayload.DeleteRes>> delete(@Valid @RequestBody PermissionPayload.DeleteCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(permissionUseCase.delete(req)));
    }
}
