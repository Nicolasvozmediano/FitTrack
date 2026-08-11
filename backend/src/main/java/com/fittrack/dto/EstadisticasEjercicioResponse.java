package com.fittrack.dto;

public class EstadisticasEjercicioResponse {

    private Long ejercicioId;
    private String nombreEjercicio;
    private Integer totalSeries;
    private Double pesoMaximo;
    private Double volumenTotal;
    private Double mejorVolumenSerie;


    public EstadisticasEjercicioResponse() {
    }


    public EstadisticasEjercicioResponse(
            Long ejercicioId,
            String nombreEjercicio,
            Integer totalSeries,
            Double pesoMaximo,
            Double volumenTotal,
            Double mejorVolumenSerie
    ) {
        this.ejercicioId = ejercicioId;
        this.nombreEjercicio = nombreEjercicio;
        this.totalSeries = totalSeries;
        this.pesoMaximo = pesoMaximo;
        this.volumenTotal = volumenTotal;
        this.mejorVolumenSerie = mejorVolumenSerie;
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


    public Integer getTotalSeries() {
        return totalSeries;
    }


    public void setTotalSeries(Integer totalSeries) {
        this.totalSeries = totalSeries;
    }


    public Double getPesoMaximo() {
        return pesoMaximo;
    }


    public void setPesoMaximo(Double pesoMaximo) {
        this.pesoMaximo = pesoMaximo;
    }


    public Double getVolumenTotal() {
        return volumenTotal;
    }


    public void setVolumenTotal(Double volumenTotal) {
        this.volumenTotal = volumenTotal;
    }


    public Double getMejorVolumenSerie() {
        return mejorVolumenSerie;
    }


    public void setMejorVolumenSerie(Double mejorVolumenSerie) {
        this.mejorVolumenSerie = mejorVolumenSerie;
    }
}