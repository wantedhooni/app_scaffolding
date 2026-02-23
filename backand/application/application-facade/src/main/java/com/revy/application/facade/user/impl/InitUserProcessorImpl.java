package com.revy.application.facade.user.impl;

import com.revy.application.facade.user.InitUserProcessor;
import com.revy.application.facade.user.UserProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitUserProcessorImpl implements InitUserProcessor {

    @Value("${app.bootstrap.user.email:demo@demo.dev}")
    private String demoUserEmail;

    @Value("${app.bootstrap.user.password:qwer1234!}")
    private String demoUserPassword;

    private final UserProcessor userProcessor;
    @Override
    public void initializeSecurityData() {
        userProcessor.signup(demoUserEmail, demoUserPassword, "first", "last", "DemoUser");
    }
}
