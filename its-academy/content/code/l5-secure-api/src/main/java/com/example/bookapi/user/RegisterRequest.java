package com.example.bookapi.user;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Pattern(regexp = "[a-z0-9]{3,20}", message = "ユーザー名は半角英小文字・数字の 3〜20 文字です") String username,
        @Size(min = 12, max = 100, message = "パスワードは 12 文字以上にしてください") String password) {
}
