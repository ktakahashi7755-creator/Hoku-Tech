package com.example.bookapi.book;

/** レスポンスとして返す値。返す項目を明示し、内部の構造をそのまま外に出さない */
public record BookResponse(Long id, String title, String author, String isbn) {

    static BookResponse from(Book book) {
        return new BookResponse(book.getId(), book.getTitle(), book.getAuthor(), book.getIsbn());
    }
}
