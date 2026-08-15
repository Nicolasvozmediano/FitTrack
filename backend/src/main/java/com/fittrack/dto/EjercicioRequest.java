package com.fittrack.dto;

public class EjercicioRequest {

    private String nombre;

    private Long catalogoEjercicioId;

    private Integer series;

    private Integer repeticiones;

    private Double peso;


    public EjercicioRequest() {
    }


    public String getNombre() {
        return nombre;
    }


    public void setNombre(String nombre) {
        this.nombre = nombre;
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


    public Integer getSeries() {
        return series;
    }


    public void setSeries(Integer series) {
        this.series = series;
    }


    public Integer getRepeticiones() {
        return repeticiones;
    }


    public void setRepeticiones(Integer repeticiones) {
        this.repeticiones = repeticiones;
    }


    public Double getPeso() {
        return peso;
    }


    public void setPeso(Double peso) {
        this.peso = peso;
    }
}