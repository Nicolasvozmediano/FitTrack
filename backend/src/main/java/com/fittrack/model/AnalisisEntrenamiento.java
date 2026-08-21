package com.fittrack.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "analisis_entrenamientos")
public class AnalisisEntrenamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "entrenamiento_id",
            nullable = false
    )
    private Entrenamiento entrenamiento;


    @Column(
            name = "analisis",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String analisis;


    @Column(
            name = "modo",
            nullable = false,
            length = 20
    )
    private String modo;


    @Column(
            name = "fecha_generacion",
            nullable = false
    )
    private LocalDateTime fechaGeneracion;


    public AnalisisEntrenamiento() {
    }


    @PrePersist
    public void prePersist() {

        if (fechaGeneracion == null) {

            fechaGeneracion =
                    LocalDateTime.now();
        }
    }


    public Long getId() {
        return id;
    }


    public void setId(
            Long id
    ) {
        this.id = id;
    }


    public Entrenamiento getEntrenamiento() {
        return entrenamiento;
    }


    public void setEntrenamiento(
            Entrenamiento entrenamiento
    ) {
        this.entrenamiento = entrenamiento;
    }


    public String getAnalisis() {
        return analisis;
    }


    public void setAnalisis(
            String analisis
    ) {
        this.analisis = analisis;
    }


    public String getModo() {
        return modo;
    }


    public void setModo(
            String modo
    ) {
        this.modo = modo;
    }


    public LocalDateTime getFechaGeneracion() {
        return fechaGeneracion;
    }


    public void setFechaGeneracion(
            LocalDateTime fechaGeneracion
    ) {
        this.fechaGeneracion =
                fechaGeneracion;
    }
}