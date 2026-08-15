package com.fittrack.service;

import com.fittrack.dto.EstadisticasEjercicioResponse;
import com.fittrack.dto.ProgresoEjercicioResponse;
import com.fittrack.dto.ProgresoSesionEjercicioResponse;
import com.fittrack.dto.RecordEjercicioResponse;
import com.fittrack.model.Ejercicio;
import com.fittrack.model.Serie;
import com.fittrack.repository.EjercicioRepository;
import com.fittrack.repository.SerieRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;


@Service
public class SerieService {

    private final SerieRepository serieRepository;
    private final EjercicioRepository ejercicioRepository;


    public SerieService(
            SerieRepository serieRepository,
            EjercicioRepository ejercicioRepository
    ) {
        this.serieRepository = serieRepository;
        this.ejercicioRepository = ejercicioRepository;
    }


    // GUARDAR O ACTUALIZAR SERIE

    public Serie guardarSerie(
            Serie serie
    ) {
        return serieRepository.save(serie);
    }


    // BUSCAR SERIE POR ID

    public Optional<Serie> buscarPorId(
            Long serieId
    ) {
        return serieRepository.findById(serieId);
    }


    // ELIMINAR SERIE

    public void eliminarSerie(
            Long serieId
    ) {
        serieRepository.deleteById(serieId);
    }


    // OBTENER SERIES DE UN EJERCICIO

    public List<Serie> obtenerSeriesEjercicio(
            Long ejercicioId
    ) {
        return serieRepository.findByEjercicioId(ejercicioId);
    }


    // OBTENER HISTORIAL DE UN EJERCICIO

    public List<Serie> obtenerHistorialEjercicio(
            Long ejercicioId
    ) {
        return serieRepository
                .findByEjercicioIdOrderByFechaAsc(ejercicioId);
    }


    // OBTENER TODAS LAS SERIES

    public List<Serie> obtenerTodas() {
        return serieRepository.findAll();
    }


    // OBTENER SOLO LAS SERIES DE UN USUARIO

    public List<Serie> obtenerPorUsuario(
            Long usuarioId
    ) {
        return serieRepository
                .findByEjercicioEntrenamientoUsuarioId(usuarioId);
    }


    // ESTADÍSTICAS DEL EJERCICIO

    public EstadisticasEjercicioResponse obtenerEstadisticasEjercicio(
            Long ejercicioId
    ) {

        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return null;
        }


        List<Serie> series =
                serieRepository.findByEjercicioId(ejercicioId);


        int totalSeries = 0;
        double pesoMaximo = 0.0;
        double volumenTotal = 0.0;
        double mejorVolumenSerie = 0.0;


        for (Serie serie : series) {

            if (serie.getPeso() == null
                    || serie.getRepeticiones() == null) {

                continue;
            }


            totalSeries++;


            double peso =
                    serie.getPeso();


            int repeticiones =
                    serie.getRepeticiones();


            double volumenSerie =
                    peso * repeticiones;


            if (peso > pesoMaximo) {
                pesoMaximo = peso;
            }


            volumenTotal += volumenSerie;


            if (volumenSerie > mejorVolumenSerie) {
                mejorVolumenSerie = volumenSerie;
            }
        }


        return new EstadisticasEjercicioResponse(
                ejercicio.getId(),
                ejercicio.getNombre(),
                totalSeries,
                pesoMaximo,
                volumenTotal,
                mejorVolumenSerie
        );
    }


    // RÉCORD DEL EJERCICIO

    public RecordEjercicioResponse obtenerRecordEjercicio(
            Long ejercicioId
    ) {

        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return null;
        }


        List<Serie> series =
                serieRepository.findByEjercicioId(ejercicioId);


        Serie mejorSerie = null;


        for (Serie serie : series) {

            if (serie.getPeso() == null
                    || serie.getRepeticiones() == null) {

                continue;
            }


            if (mejorSerie == null
                    || serie.getPeso() > mejorSerie.getPeso()) {

                mejorSerie = serie;
            }
        }


        if (mejorSerie == null) {

            return new RecordEjercicioResponse(
                    ejercicio.getId(),
                    ejercicio.getNombre(),
                    0.0,
                    0,
                    0.0,
                    null
            );
        }


        double volumenSerie =
                mejorSerie.getPeso()
                        * mejorSerie.getRepeticiones();


        return new RecordEjercicioResponse(
                ejercicio.getId(),
                ejercicio.getNombre(),
                mejorSerie.getPeso(),
                mejorSerie.getRepeticiones(),
                volumenSerie,
                mejorSerie.getFecha()
        );
    }


    // PROGRESO ENTRE LAS DOS ÚLTIMAS SERIES

    public ProgresoEjercicioResponse obtenerProgresoEjercicio(
            Long ejercicioId
    ) {

        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return null;
        }


        List<Serie> seriesValidas =
                serieRepository
                        .findByEjercicioId(ejercicioId)
                        .stream()
                        .filter(serie ->
                                serie.getPeso() != null
                                        && serie.getRepeticiones() != null
                        )
                        .sorted(
                                Comparator
                                        .comparing(
                                                Serie::getFecha,
                                                Comparator.nullsFirst(
                                                        Comparator.naturalOrder()
                                                )
                                        )
                                        .thenComparing(
                                                Serie::getId,
                                                Comparator.nullsFirst(
                                                        Comparator.naturalOrder()
                                                )
                                        )
                        )
                        .toList();


        if (seriesValidas.size() < 2) {

            return new ProgresoEjercicioResponse(
                    ejercicio.getId(),
                    ejercicio.getNombre(),
                    null,
                    null,
                    0.0,
                    0.0,
                    "DATOS_INSUFICIENTES",
                    null,
                    null
            );
        }


        Serie serieAnterior =
                seriesValidas.get(
                        seriesValidas.size() - 2
                );


        Serie serieActual =
                seriesValidas.get(
                        seriesValidas.size() - 1
                );


        double pesoAnterior =
                serieAnterior.getPeso();


        double pesoActual =
                serieActual.getPeso();


        double diferenciaPeso =
                pesoActual - pesoAnterior;


        double porcentajeCambio = 0.0;


        if (pesoAnterior != 0.0) {

            porcentajeCambio =
                    (diferenciaPeso / pesoAnterior)
                            * 100;
        }


        porcentajeCambio =
                redondearDosDecimales(
                        porcentajeCambio
                );


        String estado =
                calcularEstado(
                        diferenciaPeso
                );


        return new ProgresoEjercicioResponse(
                ejercicio.getId(),
                ejercicio.getNombre(),
                pesoAnterior,
                pesoActual,
                diferenciaPeso,
                porcentajeCambio,
                estado,
                serieAnterior.getFecha(),
                serieActual.getFecha()
        );
    }


    // PROGRESO ENTRE SESIONES

    public ProgresoSesionEjercicioResponse obtenerProgresoEntreSesiones(
            Long ejercicioActualId
    ) {

        Ejercicio ejercicioActual =
                ejercicioRepository
                        .findById(ejercicioActualId)
                        .orElse(null);


        if (ejercicioActual == null
                || ejercicioActual.getEntrenamiento() == null
                || ejercicioActual.getEntrenamiento().getUsuario() == null) {

            return null;
        }


        Long usuarioId =
                ejercicioActual
                        .getEntrenamiento()
                        .getUsuario()
                        .getId();


        /*
         * Buscamos todas las apariciones equivalentes
         * del ejercicio.
         *
         * Si pertenece al catálogo nuevo, usamos el ID
         * estable del catálogo.
         *
         * Si es un ejercicio antiguo que todavía no tiene
         * catálogo asociado, usamos el nombre como respaldo.
         */

        List<Ejercicio> ejerciciosComparables =
                obtenerEjerciciosComparables(
                        ejercicioActual,
                        usuarioId
                );


        Ejercicio ejercicioAnterior =
                buscarSesionAnterior(
                        ejercicioActual,
                        ejerciciosComparables
                );


        if (ejercicioAnterior == null) {

            return new ProgresoSesionEjercicioResponse(
                    ejercicioActual.getNombre(),
                    null,
                    ejercicioActual.getId(),
                    null,
                    ejercicioActual.getEntrenamiento().getId(),
                    null,
                    ejercicioActual.getEntrenamiento().getFecha(),
                    null,
                    obtenerPesoMaximo(
                            ejercicioActual.getId()
                    ),
                    0.0,
                    0.0,
                    "DATOS_INSUFICIENTES"
            );
        }


        Double pesoAnterior =
                obtenerPesoMaximo(
                        ejercicioAnterior.getId()
                );


        Double pesoActual =
                obtenerPesoMaximo(
                        ejercicioActual.getId()
                );


        if (pesoAnterior == null
                || pesoActual == null) {

            return new ProgresoSesionEjercicioResponse(
                    ejercicioActual.getNombre(),
                    ejercicioAnterior.getId(),
                    ejercicioActual.getId(),
                    ejercicioAnterior.getEntrenamiento().getId(),
                    ejercicioActual.getEntrenamiento().getId(),
                    ejercicioAnterior.getEntrenamiento().getFecha(),
                    ejercicioActual.getEntrenamiento().getFecha(),
                    pesoAnterior,
                    pesoActual,
                    0.0,
                    0.0,
                    "DATOS_INSUFICIENTES"
            );
        }


        double diferenciaPeso =
                pesoActual - pesoAnterior;


        double porcentajeCambio = 0.0;


        if (pesoAnterior != 0.0) {

            porcentajeCambio =
                    (diferenciaPeso / pesoAnterior)
                            * 100;
        }


        porcentajeCambio =
                redondearDosDecimales(
                        porcentajeCambio
                );


        String estado =
                calcularEstado(
                        diferenciaPeso
                );


        return new ProgresoSesionEjercicioResponse(
                ejercicioActual.getNombre(),
                ejercicioAnterior.getId(),
                ejercicioActual.getId(),
                ejercicioAnterior.getEntrenamiento().getId(),
                ejercicioActual.getEntrenamiento().getId(),
                ejercicioAnterior.getEntrenamiento().getFecha(),
                ejercicioActual.getEntrenamiento().getFecha(),
                pesoAnterior,
                pesoActual,
                diferenciaPeso,
                porcentajeCambio,
                estado
        );
    }


    // OBTENER EJERCICIOS COMPARABLES

    private List<Ejercicio> obtenerEjerciciosComparables(
            Ejercicio ejercicioActual,
            Long usuarioId
    ) {

        /*
         * NUEVO SISTEMA:
         * utilizamos la relación estable con el catálogo.
         */

        if (ejercicioActual.getCatalogoEjercicio() != null
                && ejercicioActual
                .getCatalogoEjercicio()
                .getId() != null) {

            Long catalogoEjercicioId =
                    ejercicioActual
                            .getCatalogoEjercicio()
                            .getId();


            return ejercicioRepository
                    .findByCatalogoEjercicioIdAndEntrenamientoUsuarioId(
                            catalogoEjercicioId,
                            usuarioId
                    );
        }


        /*
         * SISTEMA ANTIGUO:
         * ejercicios creados antes de introducir el catálogo.
         */

        return ejercicioRepository
                .findByNombreIgnoreCaseAndEntrenamientoUsuarioId(
                        ejercicioActual.getNombre(),
                        usuarioId
                );
    }


    // BUSCAR SESIÓN ANTERIOR

    private Ejercicio buscarSesionAnterior(
            Ejercicio ejercicioActual,
            List<Ejercicio> ejercicios
    ) {

        LocalDate fechaActual =
                ejercicioActual
                        .getEntrenamiento()
                        .getFecha();


        Long entrenamientoActualId =
                ejercicioActual
                        .getEntrenamiento()
                        .getId();


        return ejercicios
                .stream()

                .filter(ejercicio ->
                        ejercicio.getId() != null
                                && !ejercicio.getId()
                                .equals(ejercicioActual.getId())
                )

                .filter(ejercicio ->
                        ejercicio.getEntrenamiento() != null
                                && ejercicio
                                .getEntrenamiento()
                                .getId() != null
                )

                .filter(ejercicio -> {

                    LocalDate fecha =
                            ejercicio
                                    .getEntrenamiento()
                                    .getFecha();


                    Long entrenamientoId =
                            ejercicio
                                    .getEntrenamiento()
                                    .getId();


                    if (fechaActual == null) {

                        return entrenamientoId
                                < entrenamientoActualId;
                    }


                    if (fecha == null) {
                        return false;
                    }


                    if (fecha.isBefore(fechaActual)) {
                        return true;
                    }


                    return fecha.equals(fechaActual)
                            && entrenamientoId
                            < entrenamientoActualId;
                })

                .max(
                        Comparator
                                .comparing(
                                        (Ejercicio ejercicio) ->
                                                ejercicio
                                                        .getEntrenamiento()
                                                        .getFecha(),
                                        Comparator.nullsFirst(
                                                Comparator.naturalOrder()
                                        )
                                )
                                .thenComparing(
                                        ejercicio ->
                                                ejercicio
                                                        .getEntrenamiento()
                                                        .getId()
                                )
                )

                .orElse(null);
    }


    // OBTENER PESO MÁXIMO

    private Double obtenerPesoMaximo(
            Long ejercicioId
    ) {

        return serieRepository
                .findByEjercicioId(ejercicioId)
                .stream()
                .map(Serie::getPeso)
                .filter(peso ->
                        peso != null
                )
                .max(Double::compareTo)
                .orElse(null);
    }


    // CALCULAR ESTADO DEL PROGRESO

    private String calcularEstado(
            double diferencia
    ) {

        if (diferencia > 0) {
            return "MEJORA";
        }


        if (diferencia < 0) {
            return "BAJA";
        }


        return "IGUAL";
    }


    // REDONDEAR A DOS DECIMALES

    private double redondearDosDecimales(
            double numero
    ) {

        return Math.round(
                numero * 100.0
        ) / 100.0;
    }
}