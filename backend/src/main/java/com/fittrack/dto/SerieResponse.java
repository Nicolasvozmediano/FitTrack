package com.fittrack.dto;

import java.time.LocalDate;

public class SerieResponse {

    private Long id;

    private Double peso;

    private Integer repeticiones;

    private LocalDate fecha;


    public SerieResponse() {
    }


    public SerieResponse(
            Long id,
            Double peso,
            Integer repeticiones,
            LocalDate fecha
    ) {
        this.id = id;
        this.peso = peso;
        this.repeticiones = repeticiones;
        this.fecha = fecha;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Double getPeso() {
        return peso;
    }


    public void setPeso(Double peso) {
        this.peso = peso;
    }


    public Integer getRepeticiones() {
        return repeticiones;
    }


    public void setRepeticiones(Integer repeticiones) {
        this.repeticiones = repeticiones;
    }


    public LocalDate getFecha() {
        return fecha;
    }


    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}