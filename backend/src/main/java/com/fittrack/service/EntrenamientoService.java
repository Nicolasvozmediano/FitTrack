package com.fittrack.service;

import com.fittrack.dto.EstadisticasUsuarioResponse;
import com.fittrack.dto.HistorialEntrenamientoResponse;
import com.fittrack.dto.ResumenEntrenamientoResponse;
import com.fittrack.model.Ejercicio;
import com.fittrack.model.Entrenamiento;
import com.fittrack.model.Serie;
import com.fittrack.repository.EntrenamientoRepository;

import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;


@Service
public class EntrenamientoService {

    private final EntrenamientoRepository entrenamientoRepository;


    public EntrenamientoService(
            EntrenamientoRepository entrenamientoRepository
    ) {
        this.entrenamientoRepository = entrenamientoRepository;
    }


    // GUARDAR O ACTUALIZAR ENTRENAMIENTO

    public Entrenamiento guardarEntrenamiento(
            Entrenamiento entrenamiento
    ) {
        return entrenamientoRepository.save(entrenamiento);
    }


    // BUSCAR ENTRENAMIENTO POR ID

    public Optional<Entrenamiento> buscarPorId(
            Long entrenamientoId
    ) {
        return entrenamientoRepository.findById(entrenamientoId);
    }


    // ELIMINAR ENTRENAMIENTO

    public void eliminarEntrenamiento(
            Long entrenamientoId
    ) {
        entrenamientoRepository.deleteById(entrenamientoId);
    }


    // OBTENER TODOS LOS ENTRENAMIENTOS

    public List<Entrenamiento> obtenerTodos() {
        return entrenamientoRepository.findAll();
    }


    // OBTENER SOLO LOS ENTRENAMIENTOS DE UN USUARIO

    public List<Entrenamiento> obtenerPorUsuario(
            Long usuarioId
    ) {
        return entrenamientoRepository.findByUsuarioId(usuarioId);
    }


    // COMPROBAR QUE EL ENTRENAMIENTO PERTENECE AL USUARIO

    public boolean perteneceUsuario(
            Entrenamiento entrenamiento,
            Long usuarioId
    ) {

        if (entrenamiento == null
                || entrenamiento.getUsuario() == null
                || entrenamiento.getUsuario().getId() == null
                || usuarioId == null) {

            return false;
        }


        return entrenamiento.getUsuario()
                .getId()
                .equals(usuarioId);
    }


    // CALCULAR RESUMEN COMPLETO DEL ENTRENAMIENTO

    public ResumenEntrenamientoResponse obtenerResumenEntrenamiento(
            Long entrenamientoId
    ) {

        Entrenamiento entrenamiento =
                entrenamientoRepository
                        .findById(entrenamientoId)
                        .orElse(null);


        if (entrenamiento == null) {
            return null;
        }


        return convertirAResumen(entrenamiento);
    }


    // OBTENER HISTORIAL GENERAL DEL USUARIO

    public List<HistorialEntrenamientoResponse> obtenerHistorialUsuario(
            Long usuarioId
    ) {

        return entrenamientoRepository
                .findByUsuarioId(usuarioId)
                .stream()
                .sorted(
                        Comparator.comparing(
                                Entrenamiento::getFecha,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .map(this::convertirAHistorial)
                .toList();
    }


    // CALCULAR ESTADÍSTICAS GENERALES DEL USUARIO

    public EstadisticasUsuarioResponse obtenerEstadisticasUsuario(
            Long usuarioId
    ) {

        List<Entrenamiento> entrenamientosUsuario =
                entrenamientoRepository
                        .findByUsuarioId(usuarioId);


        int totalEntrenamientos =
                entrenamientosUsuario.size();

        int totalEjercicios = 0;

        int totalSeries = 0;

        double volumenTotal = 0.0;

        int duracionTotalMinutos = 0;


        for (Entrenamiento entrenamiento :
                entrenamientosUsuario) {


            if (entrenamiento.getDuracionMinutos() != null) {

                duracionTotalMinutos +=
                        entrenamiento.getDuracionMinutos();
            }


            if (entrenamiento.getEjercicios() == null) {
                continue;
            }


            totalEjercicios +=
                    entrenamiento.getEjercicios().size();


            for (Ejercicio ejercicio :
                    entrenamiento.getEjercicios()) {


                if (ejercicio.getSeries() == null) {
                    continue;
                }


                totalSeries +=
                        ejercicio.getSeries().size();


                for (Serie serie :
                        ejercicio.getSeries()) {


                    if (serie.getPeso() == null
                            || serie.getRepeticiones() == null) {

                        continue;
                    }


                    volumenTotal +=
                            serie.getPeso()
                                    * serie.getRepeticiones();
                }
            }
        }


        return new EstadisticasUsuarioResponse(
                totalEntrenamientos,
                totalEjercicios,
                totalSeries,
                volumenTotal,
                duracionTotalMinutos
        );
    }


    // CONVERTIR ENTRENAMIENTO EN RESUMEN

    private ResumenEntrenamientoResponse convertirAResumen(
            Entrenamiento entrenamiento
    ) {

        int totalEjercicios = 0;
        int totalSeries = 0;
        double volumenTotal = 0.0;


        if (entrenamiento.getEjercicios() != null) {

            totalEjercicios =
                    entrenamiento.getEjercicios().size();


            for (Ejercicio ejercicio :
                    entrenamiento.getEjercicios()) {


                if (ejercicio.getSeries() == null) {
                    continue;
                }


                totalSeries +=
                        ejercicio.getSeries().size();


                for (Serie serie :
                        ejercicio.getSeries()) {


                    if (serie.getPeso() == null
                            || serie.getRepeticiones() == null) {

                        continue;
                    }


                    volumenTotal +=
                            serie.getPeso()
                                    * serie.getRepeticiones();
                }
            }
        }


        return new ResumenEntrenamientoResponse(
                entrenamiento.getId(),
                entrenamiento.getNombre(),
                entrenamiento.getFecha(),
                entrenamiento.getDuracionMinutos(),
                totalEjercicios,
                totalSeries,
                volumenTotal
        );
    }


    // CONVERTIR ENTRENAMIENTO EN ELEMENTO DEL HISTORIAL

    private HistorialEntrenamientoResponse convertirAHistorial(
            Entrenamiento entrenamiento
    ) {

        ResumenEntrenamientoResponse resumen =
                convertirAResumen(entrenamiento);


        return new HistorialEntrenamientoResponse(
                resumen.getEntrenamientoId(),
                resumen.getNombre(),
                resumen.getFecha(),
                resumen.getDuracionMinutos(),
                resumen.getTotalEjercicios(),
                resumen.getTotalSeries(),
                resumen.getVolumenTotal()
        );
    }
}