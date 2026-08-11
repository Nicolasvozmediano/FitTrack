package com.fittrack.repository;

import com.fittrack.model.Serie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SerieRepository
        extends JpaRepository<Serie, Long> {

    // SERIES DE UN EJERCICIO

    List<Serie> findByEjercicioId(
            Long ejercicioId
    );


    // HISTORIAL DE UN EJERCICIO ORDENADO POR FECHA

    List<Serie> findByEjercicioIdOrderByFechaAsc(
            Long ejercicioId
    );


    // SERIES DE UN USUARIO

    List<Serie> findByEjercicioEntrenamientoUsuarioId(
            Long usuarioId
    );
}