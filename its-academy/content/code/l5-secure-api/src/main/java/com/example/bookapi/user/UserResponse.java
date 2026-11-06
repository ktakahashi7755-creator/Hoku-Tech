package com.example.bookapi.user;

/** パスワード (ハッシュ値を含む) はレスポンスに絶対に含めない */
public record UserResponse(Long id, String username, Role role) {

    static UserResponse from(AppUser user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getRole());
    }
}
