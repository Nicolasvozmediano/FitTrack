package com.fittrack.service;

import com.fittrack.model.CatalogoEjercicio;
import com.fittrack.repository.CatalogoEjercicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class CatalogoEjercicioService {

    private final CatalogoEjercicioRepository catalogoEjercicioRepository;


    public CatalogoEjercicioService(
            CatalogoEjercicioRepository catalogoEjercicioRepository
    ) {
        this.catalogoEjercicioRepository =
                catalogoEjercicioRepository;
    }


    // GUARDAR O ACTUALIZAR EJERCICIO DEL CATÁLOGO

    public CatalogoEjercicio guardarEjercicio(
            CatalogoEjercicio ejercicio
    ) {
        return catalogoEjercicioRepository.save(ejercicio);
    }


    // GUARDAR VARIOS EJERCICIOS

    public List<CatalogoEjercicio> guardarTodos(
            List<CatalogoEjercicio> ejercicios
    ) {
        return catalogoEjercicioRepository.saveAll(ejercicios);
    }


    // BUSCAR POR ID DE POSTGRESQL

    public Optional<CatalogoEjercicio> buscarPorId(
            Long ejercicioId
    ) {
        return catalogoEjercicioRepository
                .findById(ejercicioId);
    }


    // BUSCAR POR ID ORIGINAL DEL DATASET

    public Optional<CatalogoEjercicio> buscarPorSourceId(
            String sourceId
    ) {
        return catalogoEjercicioRepository
                .findBySourceId(sourceId);
    }


    // COMPROBAR SI YA EXISTE

    public boolean existePorSourceId(
            String sourceId
    ) {
        return catalogoEjercicioRepository
                .existsBySourceId(sourceId);
    }


    // OBTENER TODO EL CATÁLOGO

    public List<CatalogoEjercicio> obtenerTodos() {
        return catalogoEjercicioRepository.findAll();
    }


    // FILTRAR POR GRUPO MUSCULAR

    public List<CatalogoEjercicio> obtenerPorGrupo(
            String grupoFitTrack
    ) {
        return catalogoEjercicioRepository
                .findByGrupoFitTrackIgnoreCaseOrderByNombreAsc(
                        grupoFitTrack
                );
    }


    // BUSCAR POR NOMBRE

    public List<CatalogoEjercicio> buscarPorNombre(
            String nombre
    ) {
        return catalogoEjercicioRepository
                .findByNombreContainingIgnoreCaseOrderByNombreAsc(
                        nombre
                );
    }


    // FILTRAR POR GRUPO Y EQUIPAMIENTO

    public List<CatalogoEjercicio> obtenerPorGrupoYEquipamiento(
            String grupoFitTrack,
            String equipamiento
    ) {
        return catalogoEjercicioRepository
                .findByGrupoFitTrackIgnoreCaseAndEquipamientoIgnoreCaseOrderByNombreAsc(
                        grupoFitTrack,
                        equipamiento
                );
    }


    // CONTAR EJERCICIOS DEL CATÁLOGO

    public long contarEjercicios() {
        return catalogoEjercicioRepository.count();
    }
}