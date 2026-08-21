package com.fittrack.service;

import com.fittrack.model.AnalisisEntrenamiento;
import com.fittrack.model.Entrenamiento;
import com.fittrack.repository.AnalisisEntrenamientoRepository;

import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AnalisisEntrenamientoService {

    private final AnalisisEntrenamientoRepository
            analisisEntrenamientoRepository;


    public AnalisisEntrenamientoService(
            AnalisisEntrenamientoRepository
                    analisisEntrenamientoRepository
    ) {
        this.analisisEntrenamientoRepository =
                analisisEntrenamientoRepository;
    }


    // GUARDAR ANÁLISIS

    public AnalisisEntrenamiento guardarAnalisis(
            Entrenamiento entrenamiento,
            String textoAnalisis,
            String modo
    ) {

        if (entrenamiento == null) {

            throw new IllegalArgumentException(
                    "El entrenamiento no puede ser nulo"
            );
        }


        if (textoAnalisis == null
                || textoAnalisis.isBlank()) {

            throw new IllegalArgumentException(
                    "El análisis no puede estar vacío"
            );
        }


        AnalisisEntrenamiento analisis =
                new AnalisisEntrenamiento();


        analisis.setEntrenamiento(
                entrenamiento
        );


        analisis.setAnalisis(
                textoAnalisis.trim()
        );


        analisis.setModo(
                normalizarModo(
                        modo
                )
        );


        return analisisEntrenamientoRepository
                .save(
                        analisis
                );
    }


    // OBTENER ÚLTIMO ANÁLISIS

    public Optional<AnalisisEntrenamiento>
    obtenerUltimoAnalisis(
            Long entrenamientoId
    ) {

        if (entrenamientoId == null) {

            return Optional.empty();
        }


        return analisisEntrenamientoRepository
                .findTopByEntrenamientoIdOrderByFechaGeneracionDesc(
                        entrenamientoId
                );
    }


    // NORMALIZAR MODO

    private String normalizarModo(
            String modo
    ) {

        if (modo == null
                || modo.isBlank()) {

            return "SIMULADO";
        }


        String valor =
                modo.trim()
                        .toUpperCase();


        if ("OPENAI".equals(valor)) {

            return "OPENAI";
        }


        return "SIMULADO";
    }
}