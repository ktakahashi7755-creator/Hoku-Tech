package com.example.bookapi.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 利用者登録で受け取る値。
 * BCrypt は 72 バイトまでしか扱えず、それを超えると encode が例外 (500) になるため、
 * パスワードは半角の英数字・記号 (1 文字 1 バイト) の 64 文字までに制限する。
 * @Pattern と @Size は null (項目なし) を通すため、必須は @NotBlank で確かめる。
 */
public record RegisterRequest(
        @NotBlank(message = "ユーザー名は必須です")
        @Pattern(regexp = "[a-z0-9]{3,20}", message = "ユーザー名は半角英小文字・数字の 3〜20 文字です") String username,
        @NotBlank(message = "パスワードは必須です")
        @Size(min = 12, message = "パスワードは 12 文字以上にしてください")
        @Size(max = 64, message = "パスワードは 64 文字以内にしてください")
        @Pattern(regexp = "[\\x21-\\x7E]*", message = "パスワードは半角の英数字・記号で入力してください") String password) {
}
