package com.fittrack.service;

import com.fittrack.model.Serie;
import com.fittrack.repository.EjercicioRepository;
import com.fittrack.repository.SerieRepository;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class SerieServiceTest {

    private SerieService crearServicio(
            SerieRepository serieRepository
    ) {

        EjercicioRepository ejercicioRepository =
                mock(EjercicioRepository.class);

        return new SerieService(
                serieRepository,
                ejercicioRepository
        );
    }


    @Test
    void obtieneSoloSeriesDelUsuario() {

        SerieRepository serieRepository =
                mock(SerieRepository.class);

        SerieService serieService =
                crearServicio(serieRepository);

        Serie serie1 = new Serie();
        Serie serie2 = new Serie();

        when(
                serieRepository
                        .findByEjercicioEntrenamientoUsuarioId(3L)
        ).thenReturn(
                List.of(serie1, serie2)
        );


        List<Serie> resultado =
                serieService.obtenerPorUsuario(3L);


        assertEquals(
                2,
                resultado.size()
        );

        verify(serieRepository)
                .findByEjercicioEntrenamientoUsuarioId(3L);
    }


    @Test
    void guardaUnaSerie() {

        SerieRepository serieRepository =
                mock(SerieRepository.class);

        SerieService serieService =
                crearServicio(serieRepository);

        Serie serie =
                new Serie();

        serie.setPeso(80.0);
        serie.setRepeticiones(10);
        serie.setFecha(LocalDate.now());


        when(
                serieRepository.save(serie)
        ).thenReturn(serie);


        Serie resultado =
                serieService.guardarSerie(serie);


        assertSame(
                serie,
                resultado
        );

        verify(serieRepository)
                .save(serie);
    }


    @Test
    void buscaSeriePorId() {

        SerieRepository serieRepository =
                mock(SerieRepository.class);

        SerieService serieService =
                crearServicio(serieRepository);

        Serie serie =
                new Serie();

        serie.setId(8L);


        when(
                serieRepository.findById(8L)
        ).thenReturn(
                Optional.of(serie)
        );


        Optional<Serie> resultado =
                serieService.buscarPorId(8L);


        assertTrue(
                resultado.isPresent()
        );

        assertEquals(
                8L,
                resultado.get().getId()
        );
    }


    @Test
    void devuelveVacioSiSerieNoExiste() {

        SerieRepository serieRepository =
                mock(SerieRepository.class);

        SerieService serieService =
                crearServicio(serieRepository);


        when(
                serieRepository.findById(9999L)
        ).thenReturn(
                Optional.empty()
        );


        Optional<Serie> resultado =
                serieService.buscarPorId(9999L);


        assertTrue(
                resultado.isEmpty()
        );
    }


    @Test
    void eliminaSeriePorId() {

        SerieRepository serieRepository =
                mock(SerieRepository.class);

        SerieService serieService =
                crearServicio(serieRepository);


        serieService.eliminarSerie(10L);


        verify(serieRepository)
                .deleteById(10L);
    }


    @Test
    void obtieneSeriesDeUnEjercicio() {

        SerieRepository serieRepository =
                mock(SerieRepository.class);

        SerieService serieService =
                crearServicio(serieRepository);

        Serie serie1 =
                new Serie();

        Serie serie2 =
                new Serie();


        when(
                serieRepository.findByEjercicioId(4L)
        ).thenReturn(
                List.of(
                        serie1,
                        serie2
                )
        );


        List<Serie> resultado =
                serieService
                        .obtenerSeriesEjercicio(4L);


        assertEquals(
                2,
                resultado.size()
        );

        verify(serieRepository)
                .findByEjercicioId(4L);
    }
}