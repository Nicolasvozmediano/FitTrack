package com.fittrack.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "entrenamientos")
public class Entrenamiento {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String nombre;

private String fecha;

private int duracion;

private String tipo;

@ManyToOne
@JoinColumn(name = "usuario_id")
private Usuario usuario;

public Entrenamiento() {
}

public Entrenamiento(
        String nombre,
        String fecha,
        int duracion,
        String tipo,
        Usuario usuario
) {
    this.nombre = nombre;
    this.fecha = fecha;
    this.duracion = duracion;
    this.tipo = tipo;
    this.usuario = usuario;
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

public String getFecha() {
    return fecha;
}

public void setFecha(String fecha) {
    this.fecha = fecha;
}

public int getDuracion() {
    return duracion;
}

public void setDuracion(int duracion) {
    this.duracion = duracion;
}

public String getTipo() {
    return tipo;
}

public void setTipo(String tipo) {
    this.tipo = tipo;
}

public Usuario getUsuario() {
    return usuario;
}

public void setUsuario(Usuario usuario) {
    this.usuario = usuario;
}


}
