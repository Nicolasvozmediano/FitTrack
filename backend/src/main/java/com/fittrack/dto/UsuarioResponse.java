package com.fittrack.dto;

import java.time.LocalDate;

public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String email;
    private LocalDate fechaRegistro;

    public UsuarioResponse() {
    }

    public UsuarioResponse(
            Long id,
            String nombre,
            String email,
            LocalDate fechaRegistro
    ) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.fechaRegistro = fechaRegistro;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}