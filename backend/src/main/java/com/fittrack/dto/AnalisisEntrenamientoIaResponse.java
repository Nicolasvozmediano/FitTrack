package com.fittrack.dto;

public class AnalisisEntrenamientoIaResponse {

    private Long entrenamientoId;
    private String nombreEntrenamiento;
    private String analisis;


    public AnalisisEntrenamientoIaResponse() {
    }


    public AnalisisEntrenamientoIaResponse(
            Long entrenamientoId,
            String nombreEntrenamiento,
            String analisis
    ) {
        this.entrenamientoId = entrenamientoId;
        this.nombreEntrenamiento = nombreEntrenamiento;
        this.analisis = analisis;
    }


    public Long getEntrenamientoId() {
        return entrenamientoId;
    }


    public void setEntrenamientoId(
            Long entrenamientoId
    ) {
        this.entrenamientoId = entrenamientoId;
    }


    public String getNombreEntrenamiento() {
        return nombreEntrenamiento;
    }


    public void setNombreEntrenamiento(
            String nombreEntrenamiento
    ) {
        this.nombreEntrenamiento = nombreEntrenamiento;
    }


    public String getAnalisis() {
        return analisis;
    }


    public void setAnalisis(
            String analisis
    ) {
        this.analisis = analisis;
    }
}