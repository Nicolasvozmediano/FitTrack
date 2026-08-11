package com.fittrack.service;

import com.fittrack.model.Ejercicio;
import com.fittrack.repository.EjercicioRepository;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class EjercicioServiceTest {

    @Test
    void guardaEjercicio() {

        EjercicioRepository repository =
                mock(EjercicioRepository.class);

        EjercicioService service =
                new EjercicioService(repository);

        Ejercicio ejercicio =
                new Ejercicio();

        ejercicio.setNombre("Press banca");


        when(repository.save(ejercicio))
                .thenReturn(ejercicio);


        Ejercicio resultado =
                service.guardarEjercicio(ejercicio);


        assertSame(
                ejercicio,
                resultado
        );

        verify(repository)
                .save(ejercicio);
    }


    @Test
    void buscaEjercicioPorId() {

        EjercicioRepository repository =
                mock(EjercicioRepository.class);

        EjercicioService service =
                new EjercicioService(repository);

        Ejercicio ejercicio =
                new Ejercicio();

        ejercicio.setId(4L);


        when(repository.findById(4L))
                .thenReturn(
                        Optional.of(ejercicio)
                );


        Optional<Ejercicio> resultado =
                service.buscarPorId(4L);


        assertTrue(
                resultado.isPresent()
        );

        assertEquals(
                4L,
                resultado.get().getId()
        );
    }


    @Test
    void devuelveVacioSiEjercicioNoExiste() {

        EjercicioRepository repository =
                mock(EjercicioRepository.class);

        EjercicioService service =
                new EjercicioService(repository);


        when(repository.findById(9999L))
                .thenReturn(
                        Optional.empty()
                );


        Optional<Ejercicio> resultado =
                service.buscarPorId(9999L);


        assertTrue(
                resultado.isEmpty()
        );
    }


    @Test
    void eliminaEjercicio() {

        EjercicioRepository repository =
                mock(EjercicioRepository.class);

        EjercicioService service =
                new EjercicioService(repository);


        service.eliminarEjercicio(5L);


        verify(repository)
                .deleteById(5L);
    }


    @Test
    void obtieneEjerciciosDeEntrenamiento() {

        EjercicioRepository repository =
                mock(EjercicioRepository.class);

        EjercicioService service =
                new EjercicioService(repository);

        Ejercicio ejercicio1 =
                new Ejercicio();

        Ejercicio ejercicio2 =
                new Ejercicio();


        when(
                repository.findByEntrenamientoId(2L)
        ).thenReturn(
                List.of(
                        ejercicio1,
                        ejercicio2
                )
        );


        List<Ejercicio> resultado =
                service.obtenerEjerciciosPorEntrenamiento(
                        2L
                );


        assertEquals(
                2,
                resultado.size()
        );

        verify(repository)
                .findByEntrenamientoId(2L);
    }
}