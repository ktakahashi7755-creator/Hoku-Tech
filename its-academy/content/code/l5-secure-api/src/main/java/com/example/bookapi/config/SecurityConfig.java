package com.example.bookapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // URL とメソッドごとに「誰が使えるか」を決める (上から順に判定される)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()   // 新規登録は誰でも
                        .requestMatchers("/api/hello", "/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books/**").authenticated() // 閲覧はログインした人
                        .requestMatchers("/api/books/**").hasRole("ADMIN")               // 登録・更新・削除は管理者だけ
                        .anyRequest().authenticated())
                // HTTP Basic 認証: リクエストごとにユーザー名とパスワードを送る (必ず HTTPS で使う)
                .httpBasic(basic -> basic.authenticationEntryPoint(ProblemResponses.unauthorized()))
                // 401 (未ログイン・認証失敗) と 403 (権限なし) の応答をそろえる
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(ProblemResponses.unauthorized())
                        .accessDeniedHandler(ProblemResponses.forbidden()))
                // セッションを作らない (毎回認証する API のため)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // CSRF 対策は Cookie でログイン状態を保つ画面アプリで必須。Cookie を使わないこの API では無効にする
                .csrf(csrf -> csrf.disable());
        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        // 既定は BCrypt。保存値に {bcrypt} の印が付くので、将来アルゴリズムを変えても古いハッシュと共存できる
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
