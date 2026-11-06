package com.example.bookapi.book;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

// インターフェースを書くだけで、保存・検索・削除の実装を Spring Data JPA が用意する
public interface BookRepository extends JpaRepository<Book, Long> {

    // メソッド名から SQL が作られる: WHERE author = ? ORDER BY id
    List<Book> findByAuthorOrderById(String author);

    boolean existsByIsbn(String isbn);
}
