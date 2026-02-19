package com.revy.api.admin.server.api.admin;

import com.revy.api.admin.server.api.admin.payload.AdminPayload;
import com.revy.api.admin.server.api.admin.usecase.AdminUseCase;
import com.revy.api.admin.server.common.ApiResponse;
import com.revy.api.admin.server.common.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "사용자 관리 API", description = "사용자 CRUD")
public class AdminApi {
    private final AdminUseCase adminUseCase;

    @Valid
    @Operation(summary = "사용자 생성", description = "")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<AdminPayload.Res>> create(@Valid @RequestBody AdminPayload.CreateReq req) {
        return ResponseEntity.ok(ApiResponse.ok(adminUseCase.create(req)));
    }

    @Operation(summary = "사용자 단건 조회", description = "")
    @GetMapping("/{adminId}")
    public ResponseEntity<ApiResponse<AdminPayload.Res>> get(@PathVariable UUID adminId) {
        return ResponseEntity.ok(ApiResponse.ok(adminUseCase.get(adminId)));
    }

    @Operation(summary = "사용자 목록 조회", description = "")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminPayload.Res>>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(adminUseCase.getPage(page, size)));
    }

    @Operation(summary = "사용자 수정 커맨드", description = "")
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<AdminPayload.Res>> update(@Valid @RequestBody AdminPayload.UpdateCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(
                adminUseCase.update(
                        UUID.fromString(req.adminId()),
                        new AdminPayload.UpdateReq(req.email(), req.password(), req.status(), req.enabled())
                )
        ));
    }

    @Operation(summary = "사용자 삭제 커맨드", description = "")
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<AdminPayload.DeleteRes>> delete(@Valid @RequestBody AdminPayload.DeleteCommandReq req) {
        return ResponseEntity.ok(ApiResponse.ok(adminUseCase.delete(UUID.fromString(req.adminId()))));
    }
}
