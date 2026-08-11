package com.fittrack.dto;

import java.time.LocalDate;

public class ProgresoSesionEjercicioResponse {

    private String nombreEjercicio;

    private Long ejercicioAnteriorId;
    private Long ejercicioActualId;

    private Long entrenamientoAnteriorId;
    private Long entrenamientoActualId;

    private LocalDate fechaAnterior;
    private LocalDate fechaActual;

    private Double pesoMaximoAnterior;
    private Double pesoMaximoActual;

    private Double diferenciaPeso;
    private Double porcentajeCambio;

    private String estado;


    public ProgresoSesionEjercicioResponse() {
    }


    public ProgresoSesionEjercicioResponse(
            String nombreEjercicio,
            Long ejercicioAnteriorId,
            Long ejercicioActualId,
            Long entrenamientoAnteriorId,
            Long entrenamientoActualId,
            LocalDate fechaAnterior,
            LocalDate fechaActual,
            Double pesoMaximoAnterior,
            Double pesoMaximoActual,
            Double diferenciaPeso,
            Double porcentajeCambio,
            String estado
    ) {
        this.nombreEjercicio = nombreEjercicio;
        this.ejercicioAnteriorId = ejercicioAnteriorId;
        this.ejercicioActualId = ejercicioActualId;
        this.entrenamientoAnteriorId = entrenamientoAnteriorId;
        this.entrenamientoActualId = entrenamientoActualId;
        this.fechaAnterior = fechaAnterior;
        this.fechaActual = fechaActual;
        this.pesoMaximoAnterior = pesoMaximoAnterior;
        this.pesoMaximoActual = pesoMaximoActual;
        this.diferenciaPeso = diferenciaPeso;
        this.porcentajeCambio = porcentajeCambio;
        this.estado = estado;
    }


    public String getNombreEjercicio() {
        return nombreEjercicio;
    }


    public void setNombreEjercicio(String nombreEjercicio) {
        this.nombreEjercicio = nombreEjercicio;
    }


    public Long getEjercicioAnteriorId() {
        return ejercicioAnteriorId;
    }


    public void setEjercicioAnteriorId(Long ejercicioAnteriorId) {
        this.ejercicioAnteriorId = ejercicioAnteriorId;
    }


    public Long getEjercicioActualId() {
        return ejercicioActualId;
    }


    public void setEjercicioActualId(Long ejercicioActualId) {
        this.ejercicioActualId = ejercicioActualId;
    }


    public Long getEntrenamientoAnteriorId() {
        return entrenamientoAnteriorId;
    }


    public void setEntrenamientoAnteriorId(Long entrenamientoAnteriorId) {
        this.entrenamientoAnteriorId = entrenamientoAnteriorId;
    }


    public Long getEntrenamientoActualId() {
        return entrenamientoActualId;
    }


    public void setEntrenamientoActualId(Long entrenamientoActualId) {
        this.entrenamientoActualId = entrenamientoActualId;
    }


    public LocalDate getFechaAnterior() {
        return fechaAnterior;
    }


    public void setFechaAnterior(LocalDate fechaAnterior) {
        this.fechaAnterior = fechaAnterior;
    }


    public LocalDate getFechaActual() {
        return fechaActual;
    }


    public void setFechaActual(LocalDate fechaActual) {
        this.fechaActual = fechaActual;
    }


    public Double getPesoMaximoAnterior() {
        return pesoMaximoAnterior;
    }


    public void setPesoMaximoAnterior(Double pesoMaximoAnterior) {
        this.pesoMaximoAnterior = pesoMaximoAnterior;
    }


    public Double getPesoMaximoActual() {
        return pesoMaximoActual;
    }


    public void setPesoMaximoActual(Double pesoMaximoActual) {
        this.pesoMaximoActual = pesoMaximoActual;
    }


    public Double getDiferenciaPeso() {
        return diferenciaPeso;
    }


    public void setDiferenciaPeso(Double diferenciaPeso) {
        this.diferenciaPeso = diferenciaPeso;
    }


    public Double getPorcentajeCambio() {
        return porcentajeCambio;
    }


    public void setPorcentajeCambio(Double porcentajeCambio) {
        this.porcentajeCambio = porcentajeCambio;
    }


    public String getEstado() {
        return estado;
    }


    public void setEstado(String estado) {
        this.estado = estado;
    }
}