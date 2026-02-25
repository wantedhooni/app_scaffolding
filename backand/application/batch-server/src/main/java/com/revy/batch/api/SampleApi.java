package com.revy.batch.api;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sample")
@RequiredArgsConstructor
@Tag(name = "SAMPLE API", description = "SAMPLE API")
public class SampleApi {

    @GetMapping("/test")
    public String call(){
        return "Hello World!";
    }
}
