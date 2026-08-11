package com.fittrack.model;

import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
public class Serie {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Double peso;


    private Integer repeticiones;


    private LocalDate fecha;



    @ManyToOne
    @JoinColumn(name = "ejercicio_id")
    private Ejercicio ejercicio;




    public Serie() {

    }



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }



    public Double getPeso() {
        return peso;
    }


    public void setPeso(Double peso) {
        this.peso = peso;
    }



    public Integer getRepeticiones() {
        return repeticiones;
    }


    public void setRepeticiones(Integer repeticiones) {
        this.repeticiones = repeticiones;
    }



    public LocalDate getFecha() {
        return fecha;
    }


    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }



    public Ejercicio getEjercicio() {
        return ejercicio;
    }


    public void setEjercicio(Ejercicio ejercicio) {
        this.ejercicio = ejercicio;
    }

}