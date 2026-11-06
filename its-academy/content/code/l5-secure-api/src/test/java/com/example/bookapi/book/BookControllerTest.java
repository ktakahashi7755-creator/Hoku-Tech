package com.example.bookapi.book;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import com.example.bookapi.config.SecurityConfig;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

// コントローラだけを起動して試す (データベースは使わない)
// Spring Security を追加した後は、アクセス制御の設定を読み込み、管理者としてログインした状態で試す
@WebMvcTest(BookController.class)
@Import(SecurityConfig.class)
@WithMockUser(roles = "ADMIN")
class BookControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean // 本物の BookService の代わりに、振る舞いを指定できる偽物を使う
    BookService service;

    @Test
    @DisplayName("存在する本は 200 と本の情報を返す")
    void getBook() throws Exception {
        given(service.findById(1L)).willReturn(new BookResponse(1L, "Java 入門", "山田", "9784000000001"));

        mvc.perform(get("/api/books/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Java 入門"));
    }

    @Test
    @DisplayName("存在しない本は 404 と理由を返す")
    void notFound() throws Exception {
        given(service.findById(99L)).willThrow(new BookNotFoundException(99L));

        mvc.perform(get("/api/books/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("ID 99 の本は見つかりません"));
    }

    @Test
    @DisplayName("登録に成功すると 201 と Location を返す")
    void create() throws Exception {
        given(service.create(any())).willReturn(new BookResponse(5L, "SQL 入門", "佐藤", "9784000000002"));

        mvc.perform(post("/api/books").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"SQL 入門\",\"author\":\"佐藤\",\"isbn\":\"9784000000002\"}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/books/5"));
    }

    @Test
    @DisplayName("入力が不正なら 400 と項目ごとのエラーを返し、サービスは呼ばれない")
    void invalid() throws Exception {
        mvc.perform(post("/api/books").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"\",\"author\":\"佐藤\",\"isbn\":\"123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").value("タイトルは必須です"))
                .andExpect(jsonPath("$.errors.isbn").value("ISBN は 13 桁の数字です"));
    }
}
