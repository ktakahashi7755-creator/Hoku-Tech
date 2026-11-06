package com.example.bookapi.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** 登録・更新で受け取る値 (DTO)。エンティティを直接受け取らず、受け付ける項目と入力チェックをここで決める */
public record BookRequest(
        @NotBlank(message = "タイトルは必須です") @Size(max = 100, message = "タイトルは 100 文字以内です") String title,
        @NotBlank(message = "著者は必須です") @Size(max = 50, message = "著者は 50 文字以内です") String author,
        @Pattern(regexp = "\\d{13}", message = "ISBN は 13 桁の数字です") String isbn) {
}
