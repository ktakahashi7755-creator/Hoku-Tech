package com.example.bookapi.config;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

/** 401・403 も、ほかのエラーと同じ ProblemDetail 形式の JSON で返す */
final class ProblemResponses {

    private ProblemResponses() {
    }

    static AuthenticationEntryPoint unauthorized() {
        return (request, response, e) -> {
            // HTTP Basic 認証が必要なことをクライアントに伝えるヘッダ
            response.setHeader("WWW-Authenticate", "Basic realm=\"book-api\"");
            write(response, 401, "Unauthorized", "ログインが必要です", request.getRequestURI());
        };
    }

    static AccessDeniedHandler forbidden() {
        return (request, response, e) -> write(response, 403, "Forbidden", "この操作を行う権限がありません", request.getRequestURI());
    }

    private static void write(HttpServletResponse response, int status, String title, String detail, String instance) throws IOException {
        response.setStatus(status);
        response.setContentType("application/problem+json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        // 値はすべて固定の文字列とリクエストのパスのみ。例外のメッセージ (内部情報) は返さない
        response.getWriter().write("{\"detail\":\"" + detail + "\",\"instance\":\"" + instance.replace("\"", "")
                + "\",\"status\":" + status + ",\"title\":\"" + title + "\"}");
    }
}
