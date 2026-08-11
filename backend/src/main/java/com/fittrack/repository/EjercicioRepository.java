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


    // BUSCAR EL MISMO EJERCICIO EN LOS ENTRENAMIENTOS DE UN USUARIO

    List<Ejercicio> findByNombreIgnoreCaseAndEntrenamientoUsuarioId(
            String nombre,
            Long usuarioId
    );
}