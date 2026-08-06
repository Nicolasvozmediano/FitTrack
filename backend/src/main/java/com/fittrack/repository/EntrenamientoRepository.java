package com.fittrack.repository;

import com.fittrack.model.Entrenamiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntrenamientoRepository
extends JpaRepository<Entrenamiento, Long> {


List<Entrenamiento> findByUsuarioId(Long usuarioId);


}
