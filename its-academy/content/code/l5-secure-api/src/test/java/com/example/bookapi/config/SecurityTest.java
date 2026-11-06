package com.example.bookapi.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.bookapi.book.BookController;
import com.example.bookapi.book.BookResponse;
import com.example.bookapi.book.BookService;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BookController.class)
@Import(SecurityConfig.class) // 本番と同じアクセス制御の設定でテストする
class SecurityTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    PasswordEncoder passwordEncoder;

    @MockitoBean
    BookService service;

    static final String BOOK_JSON = "{\"title\":\"Java 入門\",\"author\":\"山田\",\"isbn\":\"9784000000001\"}";

    @Test
    @DisplayName("ログインしていなければ 401")
    void anonymous() throws Exception {
        mvc.perform(get("/api/books")).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("一般利用者は閲覧できる")
    void userCanRead() throws Exception {
        given(service.findAll(null)).willReturn(List.of());
        mvc.perform(get("/api/books")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("一般利用者は登録・削除できない (403)")
    void userCannotWrite() throws Exception {
        mvc.perform(post("/api/books").contentType(MediaType.APPLICATION_JSON).content(BOOK_JSON)).andExpect(status().isForbidden());
        mvc.perform(delete("/api/books/1")).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("管理者は登録できる")
    void adminCanWrite() throws Exception {
        given(service.create(any())).willReturn(new BookResponse(1L, "Java 入門", "山田", "9784000000001"));
        mvc.perform(post("/api/books").contentType(MediaType.APPLICATION_JSON).content(BOOK_JSON)).andExpect(status().isCreated());
    }

    @Test
    @DisplayName("パスワードは BCrypt のハッシュとして保存され、元の文字列は含まれない")
    void passwordIsHashed() {
        String hash = passwordEncoder.encode("correct-horse-battery");
        assertThat(hash).startsWith("{bcrypt}$2a$10$").doesNotContain("correct-horse-battery");
        assertThat(passwordEncoder.matches("correct-horse-battery", hash)).isTrue();
        assertThat(passwordEncoder.matches("wrong-password", hash)).isFalse();
        assertThat(passwordEncoder.encode("correct-horse-battery")).isNotEqualTo(hash); // 同じパスワードでも毎回違うハッシュ (ソルト)
    }
}
