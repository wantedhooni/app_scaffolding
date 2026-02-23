package com.revy.api.admin.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.persistence.autoconfigure.EntityScan;


@EntityScan(basePackages = "com.revy")
@ConfigurationPropertiesScan
@SpringBootApplication(scanBasePackages={"com.revy"})
public class ApiAdminServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiAdminServerApplication.class, args);
    }
}
