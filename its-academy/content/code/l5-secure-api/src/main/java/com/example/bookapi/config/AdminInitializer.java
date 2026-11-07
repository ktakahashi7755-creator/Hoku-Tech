package com.example.bookapi.config;

import com.example.bookapi.user.AppUser;
import com.example.bookapi.user.AppUserRepository;
import com.example.bookapi.user.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

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
        // BCrypt は 72 バイトまでしか扱えない。長すぎるときは、分かりやすいメッセージで起動を止める
        if (adminPassword.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalStateException("ADMIN_PASSWORD は 72 バイト以下にしてください (BCrypt の上限)");
        }
        repository.save(new AppUser("admin", passwordEncoder.encode(adminPassword), Role.ADMIN));
    }
}
