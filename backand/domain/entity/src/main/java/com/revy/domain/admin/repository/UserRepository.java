package com.revy.domain.admin.repository;

import com.revy.domain.base.BaseRepository;
import com.revy.domain.admin.Admin;

import java.util.UUID;

public interface UserRepository extends BaseRepository<Admin, UUID> {
}
