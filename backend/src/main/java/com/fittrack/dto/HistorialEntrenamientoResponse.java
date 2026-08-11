package com.fittrack.dto;

import java.time.LocalDate;

public class HistorialEntrenamientoResponse {

    private Long entrenamientoId;
    private String nombre;
    private LocalDate fecha;
    private Integer duracionMinutos;
    private Integer totalEjercicios;
    private Integer totalSeries;
    private Double volumenTotal;


    public HistorialEntrenamientoResponse() {
    }


    public HistorialEntrenamientoResponse(
            Long entrenamientoId,
            String nombre,
            LocalDate fecha,
            Integer duracionMinutos,
            Integer totalEjercicios,
            Integer totalSeries,
            Double volumenTotal
    ) {
        this.entrenamientoId = entrenamientoId;
        this.nombre = nombre;
        this.fecha = fecha;
        this.duracionMinutos = duracionMinutos;
        this.totalEjercicios = totalEjercicios;
        this.totalSeries = totalSeries;
        this.volumenTotal = volumenTotal;
    }


    public Long getEntrenamientoId() {
        return entrenamientoId;
    }


    public void setEntrenamientoId(Long entrenamientoId) {
        this.entrenamientoId = entrenamientoId;
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


    public Integer getTotalEjercicios() {
        return totalEjercicios;
    }


    public void setTotalEjercicios(Integer totalEjercicios) {
        this.totalEjercicios = totalEjercicios;
    }


    public Integer getTotalSeries() {
        return totalSeries;
    }


    public void setTotalSeries(Integer totalSeries) {
        this.totalSeries = totalSeries;
    }


    public Double getVolumenTotal() {
        return volumenTotal;
    }


    public void setVolumenTotal(Double volumenTotal) {
        this.volumenTotal = volumenTotal;
    }
}