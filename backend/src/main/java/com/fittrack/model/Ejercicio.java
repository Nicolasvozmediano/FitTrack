package com.fittrack.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
public class Ejercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String nombre;


    @ManyToOne
    @JoinColumn(name = "entrenamiento_id")
    private Entrenamiento entrenamiento;


    @ManyToOne
    @JoinColumn(name = "catalogo_ejercicio_id")
    private CatalogoEjercicio catalogoEjercicio;


    @OneToMany(
            mappedBy = "ejercicio",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Serie> series = new ArrayList<>();


    public Ejercicio() {
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


    public Entrenamiento getEntrenamiento() {
        return entrenamiento;
    }


    public void setEntrenamiento(
            Entrenamiento entrenamiento
    ) {
        this.entrenamiento =
                entrenamiento;
    }


    public CatalogoEjercicio getCatalogoEjercicio() {
        return catalogoEjercicio;
    }


    public void setCatalogoEjercicio(
            CatalogoEjercicio catalogoEjercicio
    ) {
        this.catalogoEjercicio =
                catalogoEjercicio;
    }


    public List<Serie> getSeries() {
        return series;
    }


    public void setSeries(
            List<Serie> series
    ) {
        this.series = series;
    }
}