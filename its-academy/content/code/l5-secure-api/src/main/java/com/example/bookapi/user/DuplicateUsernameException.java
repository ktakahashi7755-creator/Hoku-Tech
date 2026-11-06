package com.example.bookapi.user;

public class DuplicateUsernameException extends RuntimeException {

    public DuplicateUsernameException() {
        super("このユーザー名は使えません");
    }
}
