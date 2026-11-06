package com.example.bookapi.user;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/** ログイン時に Spring Security が呼び出し、データベースから利用者を探す */
@Service
public class DbUserDetailsService implements UserDetailsService {

    private final AppUserRepository repository;

    public DbUserDetailsService(AppUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        AppUser user = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("利用者が見つかりません"));
        return User.withUsername(user.getUsername())
                .password(user.getPasswordHash()) // パスワードの照合は Spring Security が PasswordEncoder で行う
                .roles(user.getRole().name())
                .build();
    }
}
