package com.fittrack.dto;

import java.time.LocalDate;

public class EntrenamientoResponse {

    private Long id;

    private String nombre;

    private LocalDate fecha;

    private Integer duracionMinutos;


    public EntrenamientoResponse() {
    }


    public EntrenamientoResponse(
            Long id,
            String nombre,
            LocalDate fecha,
            Integer duracionMinutos
    ) {
        this.id = id;
        this.nombre = nombre;
        this.fecha = fecha;
        this.duracionMinutos = duracionMinutos;
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


    public LocalDate getFecha() {
        return fecha;
    }


    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }


    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }


    public void setDuracionMinutos(Integer duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }
}