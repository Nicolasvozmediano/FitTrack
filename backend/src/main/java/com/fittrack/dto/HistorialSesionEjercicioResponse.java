package com.fittrack.dto;

import java.time.LocalDate;


public class HistorialSesionEjercicioResponse {

    private Long ejercicioId;
    private Long entrenamientoId;
    private Long catalogoEjercicioId;

    private String nombreEjercicio;

    private LocalDate fecha;

    private Double pesoMaximo;
    private Double volumenTotal;

    private Integer totalSeries;
    private Integer totalRepeticiones;


    public HistorialSesionEjercicioResponse() {
    }


    public HistorialSesionEjercicioResponse(
            Long ejercicioId,
            Long entrenamientoId,
            Long catalogoEjercicioId,
            String nombreEjercicio,
            LocalDate fecha,
            Double pesoMaximo,
            Double volumenTotal,
            Integer totalSeries,
            Integer totalRepeticiones
    ) {

        this.ejercicioId =
                ejercicioId;

        this.entrenamientoId =
                entrenamientoId;

        this.catalogoEjercicioId =
                catalogoEjercicioId;

        this.nombreEjercicio =
                nombreEjercicio;

        this.fecha =
                fecha;

        this.pesoMaximo =
                pesoMaximo;

        this.volumenTotal =
                volumenTotal;

        this.totalSeries =
                totalSeries;

        this.totalRepeticiones =
                totalRepeticiones;
    }


    public Long getEjercicioId() {
        return ejercicioId;
    }


    public void setEjercicioId(
            Long ejercicioId
    ) {
        this.ejercicioId =
                ejercicioId;
    }


    public Long getEntrenamientoId() {
        return entrenamientoId;
    }


    public void setEntrenamientoId(
            Long entrenamientoId
    ) {
        this.entrenamientoId =
                entrenamientoId;
    }


    public Long getCatalogoEjercicioId() {
        return catalogoEjercicioId;
    }


    public void setCatalogoEjercicioId(
            Long catalogoEjercicioId
    ) {
        this.catalogoEjercicioId =
                catalogoEjercicioId;
    }


    public String getNombreEjercicio() {
        return nombreEjercicio;
    }


    public void setNombreEjercicio(
            String nombreEjercicio
    ) {
        this.nombreEjercicio =
                nombreEjercicio;
    }


    public LocalDate getFecha() {
        return fecha;
    }


    public void setFecha(
            LocalDate fecha
    ) {
        this.fecha =
                fecha;
    }


    public Double getPesoMaximo() {
        return pesoMaximo;
    }


    public void setPesoMaximo(
            Double pesoMaximo
    ) {
        this.pesoMaximo =
                pesoMaximo;
    }


    public Double getVolumenTotal() {
        return volumenTotal;
    }


    public void setVolumenTotal(
            Double volumenTotal
    ) {
        this.volumenTotal =
                volumenTotal;
    }


    public Integer getTotalSeries() {
        return totalSeries;
    }


    public void setTotalSeries(
            Integer totalSeries
    ) {
        this.totalSeries =
                totalSeries;
    }


    public Integer getTotalRepeticiones() {
        return totalRepeticiones;
    }


    public void setTotalRepeticiones(
            Integer totalRepeticiones
    ) {
        this.totalRepeticiones =
                totalRepeticiones;
    }
}