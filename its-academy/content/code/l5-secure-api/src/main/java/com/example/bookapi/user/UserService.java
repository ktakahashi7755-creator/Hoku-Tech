package com.example.bookapi.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final AppUserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    /** 新規登録は必ず一般利用者 (USER)。権限は登録画面から選ばせない */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (repository.existsByUsername(request.username())) {
            throw new DuplicateUsernameException();
        }
        String hash = passwordEncoder.encode(request.password());
        return UserResponse.from(repository.save(new AppUser(request.username(), hash, Role.USER)));
    }

    @Transactional(readOnly = true)
    public UserResponse findByUsername(String username) {
        return repository.findByUsername(username).map(UserResponse::from).orElseThrow();
    }
}
