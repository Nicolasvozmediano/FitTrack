package com.fittrack.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prueba")
public class PruebaController {

    @GetMapping
    public String prueba() {
        return "Ruta protegida funcionando con JWT";
    }
}