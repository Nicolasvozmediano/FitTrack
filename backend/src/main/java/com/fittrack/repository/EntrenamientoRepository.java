package com.fittrack.repository;

import com.fittrack.model.Entrenamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntrenamientoRepository
        extends JpaRepository<Entrenamiento, Long> {

    List<Entrenamiento> findByUsuarioId(Long usuarioId);
}