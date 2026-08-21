package com.fittrack.dto;

public class PerfilAnalisisResponse {

    private Double peso;
    private Integer alturaCm;
    private String objetivo;
    private String nivelExperiencia;


    public PerfilAnalisisResponse() {
    }


    public PerfilAnalisisResponse(
            Double peso,
            Integer alturaCm,
            String objetivo,
            String nivelExperiencia
    ) {
        this.peso = peso;
        this.alturaCm = alturaCm;
        this.objetivo = objetivo;
        this.nivelExperiencia = nivelExperiencia;
    }


    public Double getPeso() {
        return peso;
    }


    public void setPeso(
            Double peso
    ) {
        this.peso = peso;
    }


    public Integer getAlturaCm() {
        return alturaCm;
    }


    public void setAlturaCm(
            Integer alturaCm
    ) {
        this.alturaCm = alturaCm;
    }


    public String getObjetivo() {
        return objetivo;
    }


    public void setObjetivo(
            String objetivo
    ) {
        this.objetivo = objetivo;
    }


    public String getNivelExperiencia() {
        return nivelExperiencia;
    }


    public void setNivelExperiencia(
            String nivelExperiencia
    ) {
        this.nivelExperiencia = nivelExperiencia;
    }
}