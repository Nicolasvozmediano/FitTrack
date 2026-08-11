package com.fittrack.dto;

import java.time.LocalDate;

public class EntrenamientoUpdateRequest {

    private String nombre;
    private LocalDate fecha;
    private Integer duracionMinutos;


    public EntrenamientoUpdateRequest() {
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