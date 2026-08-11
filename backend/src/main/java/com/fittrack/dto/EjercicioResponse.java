package com.fittrack.dto;

import com.fittrack.model.Serie;

import java.util.List;

public class EjercicioResponse {

    private Long id;

    private String nombre;

    private List<Serie> series;


    public EjercicioResponse() {
    }


    public EjercicioResponse(
            Long id,
            String nombre,
            List<Serie> series
    ) {
        this.id = id;
        this.nombre = nombre;
        this.series = series;
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


    public List<Serie> getSeries() {
        return series;
    }


    public void setSeries(List<Serie> series) {
        this.series = series;
    }
}