package com.fittrack.dto;

public class EstadisticasUsuarioResponse {

    private Integer totalEntrenamientos;
    private Integer totalEjercicios;
    private Integer totalSeries;
    private Double volumenTotal;
    private Integer duracionTotalMinutos;


    public EstadisticasUsuarioResponse() {
    }


    public EstadisticasUsuarioResponse(
            Integer totalEntrenamientos,
            Integer totalEjercicios,
            Integer totalSeries,
            Double volumenTotal,
            Integer duracionTotalMinutos
    ) {
        this.totalEntrenamientos = totalEntrenamientos;
        this.totalEjercicios = totalEjercicios;
        this.totalSeries = totalSeries;
        this.volumenTotal = volumenTotal;
        this.duracionTotalMinutos = duracionTotalMinutos;
    }


    public Integer getTotalEntrenamientos() {
        return totalEntrenamientos;
    }


    public void setTotalEntrenamientos(
            Integer totalEntrenamientos
    ) {
        this.totalEntrenamientos = totalEntrenamientos;
    }


    public Integer getTotalEjercicios() {
        return totalEjercicios;
    }


    public void setTotalEjercicios(
            Integer totalEjercicios
    ) {
        this.totalEjercicios = totalEjercicios;
    }


    public Integer getTotalSeries() {
        return totalSeries;
    }


    public void setTotalSeries(
            Integer totalSeries
    ) {
        this.totalSeries = totalSeries;
    }


    public Double getVolumenTotal() {
        return volumenTotal;
    }


    public void setVolumenTotal(
            Double volumenTotal
    ) {
        this.volumenTotal = volumenTotal;
    }


    public Integer getDuracionTotalMinutos() {
        return duracionTotalMinutos;
    }


    public void setDuracionTotalMinutos(
            Integer duracionTotalMinutos
    ) {
        this.duracionTotalMinutos = duracionTotalMinutos;
    }
}