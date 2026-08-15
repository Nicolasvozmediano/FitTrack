package com.fittrack.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "catalogo_ejercicios",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_catalogo_ejercicio_source_id",
                        columnNames = "source_id"
                )
        }
)
public class CatalogoEjercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(
            name = "source_id",
            nullable = false,
            unique = true
    )
    private String sourceId;


    @Column(name = "nombre_original")
    private String nombreOriginal;


    @Column(
            nullable = false
    )
    private String nombre;


    @Column(
            name = "grupo_fittrack",
            nullable = false
    )
    private String grupoFitTrack;


    @Column(
            nullable = false
    )
    private String equipamiento;


    @Column(
            name = "musculo_principal",
            nullable = false
    )
    private String musculoPrincipal;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "catalogo_musculos_principales",
            joinColumns = @JoinColumn(
                    name = "catalogo_ejercicio_id"
            )
    )
    @Column(name = "musculo")
    private List<String> musculosPrincipales =
            new ArrayList<>();


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "catalogo_musculos_secundarios",
            joinColumns = @JoinColumn(
                    name = "catalogo_ejercicio_id"
            )
    )
    @Column(name = "musculo")
    private List<String> musculosSecundarios =
            new ArrayList<>();


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "catalogo_instrucciones_originales",
            joinColumns = @JoinColumn(
                    name = "catalogo_ejercicio_id"
            )
    )
    @OrderColumn(name = "orden")
    @Column(
            name = "instruccion",
            columnDefinition = "TEXT"
    )
    private List<String> instruccionesOriginales =
            new ArrayList<>();


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "catalogo_instrucciones",
            joinColumns = @JoinColumn(
                    name = "catalogo_ejercicio_id"
            )
    )
    @OrderColumn(name = "orden")
    @Column(
            name = "instruccion",
            columnDefinition = "TEXT"
    )
    private List<String> instrucciones =
            new ArrayList<>();


    private String fuerza;


    private String nivel;


    private String mecanica;


    private String categoria;


    public CatalogoEjercicio() {
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getSourceId() {
        return sourceId;
    }


    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }


    public String getNombreOriginal() {
        return nombreOriginal;
    }


    public void setNombreOriginal(String nombreOriginal) {
        this.nombreOriginal = nombreOriginal;
    }


    public String getNombre() {
        return nombre;
    }


    public void setNombre(String nombre) {
        this.nombre = nombre;
    }


    public String getGrupoFitTrack() {
        return grupoFitTrack;
    }


    public void setGrupoFitTrack(String grupoFitTrack) {
        this.grupoFitTrack = grupoFitTrack;
    }


    public String getEquipamiento() {
        return equipamiento;
    }


    public void setEquipamiento(String equipamiento) {
        this.equipamiento = equipamiento;
    }


    public String getMusculoPrincipal() {
        return musculoPrincipal;
    }


    public void setMusculoPrincipal(String musculoPrincipal) {
        this.musculoPrincipal = musculoPrincipal;
    }


    public List<String> getMusculosPrincipales() {
        return musculosPrincipales;
    }


    public void setMusculosPrincipales(
            List<String> musculosPrincipales
    ) {
        this.musculosPrincipales =
                musculosPrincipales;
    }


    public List<String> getMusculosSecundarios() {
        return musculosSecundarios;
    }


    public void setMusculosSecundarios(
            List<String> musculosSecundarios
    ) {
        this.musculosSecundarios =
                musculosSecundarios;
    }


    public List<String> getInstruccionesOriginales() {
        return instruccionesOriginales;
    }


    public void setInstruccionesOriginales(
            List<String> instruccionesOriginales
    ) {
        this.instruccionesOriginales =
                instruccionesOriginales;
    }


    public List<String> getInstrucciones() {
        return instrucciones;
    }


    public void setInstrucciones(
            List<String> instrucciones
    ) {
        this.instrucciones =
                instrucciones;
    }


    public String getFuerza() {
        return fuerza;
    }


    public void setFuerza(String fuerza) {
        this.fuerza = fuerza;
    }


    public String getNivel() {
        return nivel;
    }


    public void setNivel(String nivel) {
        this.nivel = nivel;
    }


    public String getMecanica() {
        return mecanica;
    }


    public void setMecanica(String mecanica) {
        this.mecanica = mecanica;
    }


    public String getCategoria() {
        return categoria;
    }


    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}