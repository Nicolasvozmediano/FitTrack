package com.fittrack.dto;

import java.time.LocalDate;

public class ProgresoEjercicioResponse {

    private Long ejercicioId;
    private String nombreEjercicio;

    private Double pesoAnterior;
    private Double pesoActual;
    private Double diferenciaPeso;
    private Double porcentajeCambio;

    private String estado;

    private LocalDate fechaAnterior;
    private LocalDate fechaActual;


    public ProgresoEjercicioResponse() {
    }


    public ProgresoEjercicioResponse(
            Long ejercicioId,
            String nombreEjercicio,
            Double pesoAnterior,
            Double pesoActual,
            Double diferenciaPeso,
            Double porcentajeCambio,
            String estado,
            LocalDate fechaAnterior,
            LocalDate fechaActual
    ) {
        this.ejercicioId = ejercicioId;
        this.nombreEjercicio = nombreEjercicio;
        this.pesoAnterior = pesoAnterior;
        this.pesoActual = pesoActual;
        this.diferenciaPeso = diferenciaPeso;
        this.porcentajeCambio = porcentajeCambio;
        this.estado = estado;
        this.fechaAnterior = fechaAnterior;
        this.fechaActual = fechaActual;
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


    public Double getPesoAnterior() {
        return pesoAnterior;
    }


    public void setPesoAnterior(Double pesoAnterior) {
        this.pesoAnterior = pesoAnterior;
    }


    public Double getPesoActual() {
        return pesoActual;
    }


    public void setPesoActual(Double pesoActual) {
        this.pesoActual = pesoActual;
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
}