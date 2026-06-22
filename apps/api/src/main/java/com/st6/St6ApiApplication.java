package com.st6;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class St6ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(St6ApiApplication.class, args);
    }
}
