package com.fittrack.dto;

import java.time.LocalDate;

public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String email;
    private LocalDate fechaRegistro;

    private Double peso;
    private Integer alturaCm;
    private String objetivo;
    private String nivelExperiencia;


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


    public UsuarioResponse(
            Long id,
            String nombre,
            String email,
            LocalDate fechaRegistro,
            Double peso,
            Integer alturaCm,
            String objetivo,
            String nivelExperiencia
    ) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.fechaRegistro = fechaRegistro;
        this.peso = peso;
        this.alturaCm = alturaCm;
        this.objetivo = objetivo;
        this.nivelExperiencia = nivelExperiencia;
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


    public Double getPeso() {
        return peso;
    }


    public void setPeso(Double peso) {
        this.peso = peso;
    }


    public Integer getAlturaCm() {
        return alturaCm;
    }


    public void setAlturaCm(Integer alturaCm) {
        this.alturaCm = alturaCm;
    }


    public String getObjetivo() {
        return objetivo;
    }


    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }


    public String getNivelExperiencia() {
        return nivelExperiencia;
    }


    public void setNivelExperiencia(String nivelExperiencia) {
        this.nivelExperiencia = nivelExperiencia;
    }
}