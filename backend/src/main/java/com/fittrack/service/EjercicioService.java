package com.fittrack.service;

import com.fittrack.model.Ejercicio;
import com.fittrack.repository.EjercicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class EjercicioService {

    private final EjercicioRepository ejercicioRepository;


    public EjercicioService(
            EjercicioRepository ejercicioRepository
    ) {
        this.ejercicioRepository = ejercicioRepository;
    }


    // GUARDAR O ACTUALIZAR EJERCICIO

    public Ejercicio guardarEjercicio(
            Ejercicio ejercicio
    ) {
        return ejercicioRepository.save(ejercicio);
    }


    // BUSCAR EJERCICIO POR ID

    public Optional<Ejercicio> buscarPorId(
            Long ejercicioId
    ) {
        return ejercicioRepository.findById(ejercicioId);
    }


    // ELIMINAR EJERCICIO

    public void eliminarEjercicio(
            Long ejercicioId
    ) {
        ejercicioRepository.deleteById(ejercicioId);
    }


    // OBTENER EJERCICIOS DE UN ENTRENAMIENTO

    public List<Ejercicio> obtenerEjerciciosPorEntrenamiento(
            Long entrenamientoId
    ) {
        return ejercicioRepository
                .findByEntrenamientoId(entrenamientoId);
    }


    // OBTENER TODOS LOS EJERCICIOS DE UN USUARIO

    public List<Ejercicio> obtenerEjerciciosPorUsuario(
            Long usuarioId
    ) {
        return ejercicioRepository
                .findByEntrenamientoUsuarioId(usuarioId);
    }


    // OBTENER TODOS LOS EJERCICIOS

    public List<Ejercicio> obtenerTodos() {
        return ejercicioRepository.findAll();
    }
}