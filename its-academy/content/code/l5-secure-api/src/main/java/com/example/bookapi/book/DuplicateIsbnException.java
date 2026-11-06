package com.example.bookapi.book;

public class DuplicateIsbnException extends RuntimeException {

    public DuplicateIsbnException(String isbn) {
        super("ISBN " + isbn + " はすでに登録されています");
    }
}
