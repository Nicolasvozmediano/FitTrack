package com.fittrack.repository;

import com.fittrack.model.Ejercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface EjercicioRepository
        extends JpaRepository<Ejercicio, Long> {


    // OBTENER EJERCICIOS DE UN ENTRENAMIENTO

    List<Ejercicio> findByEntrenamientoId(
            Long entrenamientoId
    );


    // OBTENER TODOS LOS EJERCICIOS DE UN USUARIO

    List<Ejercicio> findByEntrenamientoUsuarioId(
            Long usuarioId
    );


    // BUSCAR EL MISMO EJERCICIO POR SU ID ESTABLE DEL CATÁLOGO

    List<Ejercicio> findByCatalogoEjercicioIdAndEntrenamientoUsuarioId(
            Long catalogoEjercicioId,
            Long usuarioId
    );


    // RESPALDO PARA EJERCICIOS ANTIGUOS SIN CATÁLOGO ASOCIADO

    List<Ejercicio> findByNombreIgnoreCaseAndEntrenamientoUsuarioId(
            String nombre,
            Long usuarioId
    );
}