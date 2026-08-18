package com.fittrack.dto;

import java.util.ArrayList;
import java.util.List;

public class EjercicioAnalisisResponse {

    private Long ejercicioId;
    private Long catalogoEjercicioId;
    private String nombre;

    private Integer totalSeries;
    private Integer totalRepeticiones;

    private Double pesoMaximo;
    private Double volumenTotal;

    private List<SerieAnalisisResponse> series =
            new ArrayList<>();


    public EjercicioAnalisisResponse() {
    }


    public EjercicioAnalisisResponse(
            Long ejercicioId,
            Long catalogoEjercicioId,
            String nombre,
            Integer totalSeries,
            Integer totalRepeticiones,
            Double pesoMaximo,
            Double volumenTotal,
            List<SerieAnalisisResponse> series
    ) {
        this.ejercicioId = ejercicioId;
        this.catalogoEjercicioId = catalogoEjercicioId;
        this.nombre = nombre;
        this.totalSeries = totalSeries;
        this.totalRepeticiones = totalRepeticiones;
        this.pesoMaximo = pesoMaximo;
        this.volumenTotal = volumenTotal;
        this.series = series;
    }


    public Long getEjercicioId() {
        return ejercicioId;
    }


    public void setEjercicioId(
            Long ejercicioId
    ) {
        this.ejercicioId = ejercicioId;
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


    public String getNombre() {
        return nombre;
    }


    public void setNombre(
            String nombre
    ) {
        this.nombre = nombre;
    }


    public Integer getTotalSeries() {
        return totalSeries;
    }


    public void setTotalSeries(
            Integer totalSeries
    ) {
        this.totalSeries = totalSeries;
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


    public Double getPesoMaximo() {
        return pesoMaximo;
    }


    public void setPesoMaximo(
            Double pesoMaximo
    ) {
        this.pesoMaximo = pesoMaximo;
    }


    public Double getVolumenTotal() {
        return volumenTotal;
    }


    public void setVolumenTotal(
            Double volumenTotal
    ) {
        this.volumenTotal = volumenTotal;
    }


    public List<SerieAnalisisResponse> getSeries() {
        return series;
    }


    public void setSeries(
            List<SerieAnalisisResponse> series
    ) {
        this.series = series;
    }
}
