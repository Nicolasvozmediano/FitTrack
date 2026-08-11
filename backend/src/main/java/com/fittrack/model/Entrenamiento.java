package com.fittrack.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Entrenamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private LocalDate fecha;

    private Integer duracionMinutos;


    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


    @OneToMany(
            mappedBy = "entrenamiento",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Ejercicio> ejercicios =
            new ArrayList<>();


    public Entrenamiento() {
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


    public LocalDate getFecha() {
        return fecha;
    }


    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }


    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }


    public void setDuracionMinutos(Integer duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }


    public Usuario getUsuario() {
        return usuario;
    }


    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }


    public List<Ejercicio> getEjercicios() {
        return ejercicios;
    }


    public void setEjercicios(
            List<Ejercicio> ejercicios
    ) {
        this.ejercicios = ejercicios;
    }
}