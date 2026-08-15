package com.fittrack.repository;

import com.fittrack.model.CatalogoEjercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CatalogoEjercicioRepository
        extends JpaRepository<CatalogoEjercicio, Long> {


    // BUSCAR POR ID ORIGINAL DEL DATASET

    Optional<CatalogoEjercicio> findBySourceId(
            String sourceId
    );


    // COMPROBAR SI YA EXISTE EN LA BASE DE DATOS

    boolean existsBySourceId(
            String sourceId
    );


    // OBTENER EJERCICIOS POR GRUPO MUSCULAR

    List<CatalogoEjercicio> findByGrupoFitTrackIgnoreCaseOrderByNombreAsc(
            String grupoFitTrack
    );


    // BUSCAR EJERCICIOS POR NOMBRE

    List<CatalogoEjercicio> findByNombreContainingIgnoreCaseOrderByNombreAsc(
            String nombre
    );


    // FILTRAR POR GRUPO Y EQUIPAMIENTO

    List<CatalogoEjercicio> findByGrupoFitTrackIgnoreCaseAndEquipamientoIgnoreCaseOrderByNombreAsc(
            String grupoFitTrack,
            String equipamiento
    );
}