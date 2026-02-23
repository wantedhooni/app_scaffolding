package com.revy.application.facade.user.impl;

import com.revy.application.facade.user.InitUserProcessor;
import com.revy.application.facade.user.UserReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitUserProcessorImpl implements InitUserProcessor {

    private final UserReader userReader;

    @Override
    public void initializeSecurityData() {

    }
}
