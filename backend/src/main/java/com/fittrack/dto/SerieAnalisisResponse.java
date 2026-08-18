package com.fittrack.dto;

import java.time.LocalDate;

public class SerieAnalisisResponse {

    private Long serieId;
    private Double peso;
    private Integer repeticiones;
    private Double volumen;
    private LocalDate fecha;


    public SerieAnalisisResponse() {
    }


    public SerieAnalisisResponse(
            Long serieId,
            Double peso,
            Integer repeticiones,
            Double volumen,
            LocalDate fecha
    ) {
        this.serieId = serieId;
        this.peso = peso;
        this.repeticiones = repeticiones;
        this.volumen = volumen;
        this.fecha = fecha;
    }


    public Long getSerieId() {
        return serieId;
    }


    public void setSerieId(Long serieId) {
        this.serieId = serieId;
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


    public Double getVolumen() {
        return volumen;
    }


    public void setVolumen(Double volumen) {
        this.volumen = volumen;
    }


    public LocalDate getFecha() {
        return fecha;
    }


    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}