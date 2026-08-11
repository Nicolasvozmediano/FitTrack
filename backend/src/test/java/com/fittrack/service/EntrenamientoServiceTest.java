package com.fittrack.service;

import com.fittrack.model.Entrenamiento;
import com.fittrack.model.Usuario;
import com.fittrack.repository.EntrenamientoRepository;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


class EntrenamientoServiceTest {

    @Test
    void entrenamientoNullNoPerteneceAUsuario() {

        EntrenamientoRepository entrenamientoRepository =
                mock(EntrenamientoRepository.class);

        EntrenamientoService entrenamientoService =
                new EntrenamientoService(
                        entrenamientoRepository
                );

        boolean resultado =
                entrenamientoService.perteneceUsuario(
                        null,
                        3L
                );

        assertFalse(resultado);
    }


    @Test
    void entrenamientoPerteneceAlUsuarioCorrecto() {

        EntrenamientoRepository entrenamientoRepository =
                mock(EntrenamientoRepository.class);

        EntrenamientoService entrenamientoService =
                new EntrenamientoService(
                        entrenamientoRepository
                );

        Entrenamiento entrenamiento =
                mock(Entrenamiento.class);

        Usuario usuario =
                mock(Usuario.class);

        when(entrenamiento.getUsuario())
                .thenReturn(usuario);

        when(usuario.getId())
                .thenReturn(3L);

        boolean resultado =
                entrenamientoService.perteneceUsuario(
                        entrenamiento,
                        3L
                );

        assertTrue(resultado);
    }


    @Test
    void entrenamientoNoPerteneceAOtroUsuario() {

        EntrenamientoRepository entrenamientoRepository =
                mock(EntrenamientoRepository.class);

        EntrenamientoService entrenamientoService =
                new EntrenamientoService(
                        entrenamientoRepository
                );

        Entrenamiento entrenamiento =
                mock(Entrenamiento.class);

        Usuario usuario =
                mock(Usuario.class);

        when(entrenamiento.getUsuario())
                .thenReturn(usuario);

        when(usuario.getId())
                .thenReturn(3L);

        boolean resultado =
                entrenamientoService.perteneceUsuario(
                        entrenamiento,
                        99L
                );

        assertFalse(resultado);
    }


    @Test
    void obtieneSoloEntrenamientosDelUsuario() {

        EntrenamientoRepository entrenamientoRepository =
                mock(EntrenamientoRepository.class);

        EntrenamientoService entrenamientoService =
                new EntrenamientoService(
                        entrenamientoRepository
                );

        Entrenamiento entrenamiento1 =
                mock(Entrenamiento.class);

        Entrenamiento entrenamiento2 =
                mock(Entrenamiento.class);

        List<Entrenamiento> entrenamientos =
                List.of(
                        entrenamiento1,
                        entrenamiento2
                );

        when(
                entrenamientoRepository.findByUsuarioId(3L)
        ).thenReturn(entrenamientos);


        List<Entrenamiento> resultado =
                entrenamientoService.obtenerPorUsuario(
                        3L
                );


        assertEquals(
                2,
                resultado.size()
        );
    }
}