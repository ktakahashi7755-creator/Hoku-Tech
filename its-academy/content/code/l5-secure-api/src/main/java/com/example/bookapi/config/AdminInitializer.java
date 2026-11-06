package com.example.bookapi.config;

import com.example.bookapi.user.AppUser;
import com.example.bookapi.user.AppUserRepository;
import com.example.bookapi.user.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** 起動時に初期管理者を作る。パスワードはソースコードに書かず、環境変数 ADMIN_PASSWORD から受け取る */
@Component
public class AdminInitializer implements CommandLineRunner {

    private final AppUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String adminPassword;

    public AdminInitializer(AppUserRepository repository, PasswordEncoder passwordEncoder,
            @Value("${app.admin.password}") String adminPassword) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (adminPassword.isBlank() || repository.existsByUsername("admin")) {
            return;
        }
        repository.save(new AppUser("admin", passwordEncoder.encode(adminPassword), Role.ADMIN));
    }
}
