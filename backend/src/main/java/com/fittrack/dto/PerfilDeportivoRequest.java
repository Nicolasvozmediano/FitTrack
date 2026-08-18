package com.fittrack.dto;

public class PerfilDeportivoRequest {

    private Double peso;
    private Integer alturaCm;
    private String objetivo;
    private String nivelExperiencia;


    public PerfilDeportivoRequest() {
    }


    public Double getPeso() {
        return peso;
    }


    public void setPeso(Double peso) {
        this.peso = peso;
    }


    public Integer getAlturaCm() {
        return alturaCm;
    }


    public void setAlturaCm(Integer alturaCm) {
        this.alturaCm = alturaCm;
    }


    public String getObjetivo() {
        return objetivo;
    }


    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }


    public String getNivelExperiencia() {
        return nivelExperiencia;
    }


    public void setNivelExperiencia(String nivelExperiencia) {
        this.nivelExperiencia = nivelExperiencia;
    }
}