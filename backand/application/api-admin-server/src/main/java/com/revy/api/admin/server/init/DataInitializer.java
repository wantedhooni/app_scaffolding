package com.revy.api.admin.server.init;

import com.revy.application.facade.administrator.admin.AdminReader;
import com.revy.application.facade.administrator.admin.InitAdminProcessor;
import com.revy.application.facade.user.InitUserProcessor;
import com.revy.application.facade.user.UserReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final AdminReader adminReader;
    private final InitAdminProcessor initAdminProcessor;
    private final UserReader userReader;
    private final InitUserProcessor initUserProcessor;

    @Override
    public void run(String... args) throws Exception {
        log.info("DataInitializer start");
        if (!adminReader.hasAnySecurityData()) {
            initAdminProcessor.initializeSecurityData();
        } else {
            log.info("security seed skipped: existing admin/role/permission data found");
        }

        if(!userReader.hasAnySecurityData()){
            initUserProcessor.initializeSecurityData();
        }

        log.info("DataInitializer end");
    }
}
