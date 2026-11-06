package com.example.bookapi.hello;

import org.springframework.stereotype.Service;

@Service // Spring に管理させる部品 (Bean) であることを示す
public class GreetingService {

    public String greet(String name) {
        return "Hello, " + name + "!";
    }
}
