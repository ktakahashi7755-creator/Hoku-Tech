package com.example.bookapi.book;

public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(Long id) {
        super("ID " + id + " の本は見つかりません");
    }
}
