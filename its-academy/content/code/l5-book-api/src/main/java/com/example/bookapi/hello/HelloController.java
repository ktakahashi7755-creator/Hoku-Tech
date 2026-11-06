package com.example.bookapi.hello;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController // 戻り値をそのままレスポンスの本文 (JSON や文字列) にするコントローラ
public class HelloController {

    private final GreetingService greetingService;

    // コンストラクタインジェクション: Spring が GreetingService のオブジェクトを渡してくれる
    public HelloController(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    @GetMapping("/api/hello") // GET /api/hello にこのメソッドを対応させる
    public String hello(@RequestParam(defaultValue = "guest") String name) {
        return greetingService.greet(name);
    }
}
