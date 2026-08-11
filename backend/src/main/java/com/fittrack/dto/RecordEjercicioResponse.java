package com.fittrack.dto;

import java.time.LocalDate;

public class RecordEjercicioResponse {

    private Long ejercicioId;
    private String nombreEjercicio;
    private Double pesoMaximo;
    private Integer repeticiones;
    private Double volumenSerie;
    private LocalDate fecha;


    public RecordEjercicioResponse() {
    }


    public RecordEjercicioResponse(
            Long ejercicioId,
            String nombreEjercicio,
            Double pesoMaximo,
            Integer repeticiones,
            Double volumenSerie,
            LocalDate fecha
    ) {
        this.ejercicioId = ejercicioId;
        this.nombreEjercicio = nombreEjercicio;
        this.pesoMaximo = pesoMaximo;
        this.repeticiones = repeticiones;
        this.volumenSerie = volumenSerie;
        this.fecha = fecha;
    }


    public Long getEjercicioId() {
        return ejercicioId;
    }


    public void setEjercicioId(Long ejercicioId) {
        this.ejercicioId = ejercicioId;
    }


    public String getNombreEjercicio() {
        return nombreEjercicio;
    }


    public void setNombreEjercicio(String nombreEjercicio) {
        this.nombreEjercicio = nombreEjercicio;
    }


    public Double getPesoMaximo() {
        return pesoMaximo;
    }


    public void setPesoMaximo(Double pesoMaximo) {
        this.pesoMaximo = pesoMaximo;
    }


    public Integer getRepeticiones() {
        return repeticiones;
    }


    public void setRepeticiones(Integer repeticiones) {
        this.repeticiones = repeticiones;
    }


    public Double getVolumenSerie() {
        return volumenSerie;
    }


    public void setVolumenSerie(Double volumenSerie) {
        this.volumenSerie = volumenSerie;
    }


    public LocalDate getFecha() {
        return fecha;
    }


    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}