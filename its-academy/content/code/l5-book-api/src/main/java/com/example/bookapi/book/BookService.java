package com.example.bookapi.book;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true) // 既定は読み取り専用。更新するメソッドだけ上書きする
public class BookService {

    private final BookRepository repository;

    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    public List<BookResponse> findAll(String author) {
        List<Book> books = author == null ? repository.findAll() : repository.findByAuthorOrderById(author);
        return books.stream().map(BookResponse::from).toList();
    }

    public BookResponse findById(Long id) {
        return repository.findById(id).map(BookResponse::from).orElseThrow(() -> new BookNotFoundException(id));
    }

    @Transactional // 途中で例外が起きたら、このメソッド内の変更はすべて取り消される
    public BookResponse create(BookRequest request) {
        if (repository.existsByIsbn(request.isbn())) {
            throw new DuplicateIsbnException(request.isbn());
        }
        Book saved = repository.save(new Book(request.title(), request.author(), request.isbn()));
        return BookResponse.from(saved);
    }

    @Transactional
    public BookResponse update(Long id, BookRequest request) {
        Book book = repository.findById(id).orElseThrow(() -> new BookNotFoundException(id));
        book.update(request.title(), request.author()); // トランザクション終了時に UPDATE 文が実行される
        return BookResponse.from(book);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new BookNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
