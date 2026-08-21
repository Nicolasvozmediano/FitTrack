package com.fittrack.repository;

import com.fittrack.model.AnalisisEntrenamiento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface AnalisisEntrenamientoRepository
        extends JpaRepository<AnalisisEntrenamiento, Long> {


    Optional<AnalisisEntrenamiento>
    findTopByEntrenamientoIdOrderByFechaGeneracionDesc(
            Long entrenamientoId
    );
}