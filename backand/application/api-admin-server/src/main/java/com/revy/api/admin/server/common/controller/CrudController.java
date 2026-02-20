package com.revy.api.admin.server.common.controller;

import com.revy.api.admin.server.common.ApiResponse;
import com.revy.api.admin.server.common.PageResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

public abstract class CrudController<CREQ, UREQ, DREQ, RES, DRES> {

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<RES>> create(@Valid @RequestBody CREQ req) {
        return ResponseEntity.ok(ApiResponse.ok(doCreate(req)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RES>> get(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(doGet(id)));
    }

    @GetMapping({"", "/list", "/search"})
    public ResponseEntity<ApiResponse<PageResponse<RES>>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String searchBy,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @ModelAttribute QueryParams queryParams,
            HttpServletRequest request
    ) {
        queryParams.loadFrom(request);

        Map<String, List<String>> extraFilters = new LinkedHashMap<>();
        for (Map.Entry<String, List<String>> entry : queryParams.values().entrySet()) {
            if (isStandardParam(entry.getKey())) {
                continue;
            }
            extraFilters.put(entry.getKey(), entry.getValue());
        }

        CrudSearchCondition condition = new CrudSearchCondition(
                keyword,
                searchBy,
                sortBy,
                sortDirection.toUpperCase(Locale.ROOT),
                from,
                to,
                extraFilters
        );
        return ResponseEntity.ok(ApiResponse.ok(doGetPage(page, size, condition)));
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse<RES>> update(@Valid @RequestBody UREQ req) {
        return ResponseEntity.ok(ApiResponse.ok(doUpdate(req)));
    }

    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<DRES>> delete(@Valid @RequestBody DREQ req) {
        return ResponseEntity.ok(ApiResponse.ok(doDelete(req)));
    }

    protected abstract RES doCreate(CREQ req);

    protected abstract RES doGet(UUID id);

    protected abstract PageResponse<RES> doGetPage(int page, int size);

    protected PageResponse<RES> doGetPage(int page, int size, CrudSearchCondition condition) {
        return doGetPage(page, size);
    }

    protected abstract RES doUpdate(UREQ req);

    protected abstract DRES doDelete(DREQ req);

    private boolean isStandardParam(String key) {
        return "page".equals(key)
                || "size".equals(key)
                || "keyword".equals(key)
                || "searchBy".equals(key)
                || "sortBy".equals(key)
                || "sortDirection".equals(key)
                || "from".equals(key)
                || "to".equals(key);
    }

    protected record CrudSearchCondition(
            String keyword,
            String searchBy,
            String sortBy,
            String sortDirection,
            String from,
            String to,
            Map<String, List<String>> extraFilters
    ) {
    }

    public static final class QueryParams {
        private final MultiValueMap<String, String> values = new LinkedMultiValueMap<>();

        public MultiValueMap<String, String> values() {
            return values;
        }

        void loadFrom(HttpServletRequest request) {
            values.clear();
            for (Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
                values.put(entry.getKey(), Arrays.asList(entry.getValue()));
            }
        }
    }
}
