package com.fittrack.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fittrack.model.CatalogoEjercicio;
import com.fittrack.repository.CatalogoEjercicioRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


@Component
public class CatalogoEjercicioImporter
        implements ApplicationRunner {

    private static final String ARCHIVO_JSON =
            "data/fittrack-exercises-es-final-v3.json";


    private final CatalogoEjercicioRepository
            catalogoEjercicioRepository;

    private final ObjectMapper objectMapper;


    public CatalogoEjercicioImporter(
            CatalogoEjercicioRepository catalogoEjercicioRepository,
            ObjectMapper objectMapper
    ) {
        this.catalogoEjercicioRepository =
                catalogoEjercicioRepository;

        this.objectMapper =
                objectMapper;
    }


    @Override
    public void run(
            ApplicationArguments args
    ) throws Exception {

        System.out.println("");
        System.out.println(
                "===================================="
        );
        System.out.println(
                "FITTRACK - IMPORTACIÓN CATÁLOGO"
        );
        System.out.println(
                "===================================="
        );


        ClassPathResource resource =
                new ClassPathResource(
                        ARCHIVO_JSON
                );


        if (!resource.exists()) {

            System.out.println(
                    "No se encuentra el archivo:"
            );

            System.out.println(
                    ARCHIVO_JSON
            );

            return;
        }


        List<CatalogoEjercicio> nuevos =
                new ArrayList<>();


        int encontrados = 0;
        int existentes = 0;


        try (
                InputStream inputStream =
                        resource.getInputStream()
        ) {

            JsonNode raiz =
                    objectMapper.readTree(
                            inputStream
                    );


            if (!raiz.isArray()) {

                throw new IllegalStateException(
                        "El archivo del catálogo "
                                + "no contiene un array JSON."
                );
            }


            for (JsonNode nodo : raiz) {

                encontrados++;


                String sourceId =
                        obtenerTexto(
                                nodo,
                                "id"
                        );


                if (
                        sourceId == null
                                || sourceId.isBlank()
                ) {

                    System.out.println(
                            "Ejercicio omitido: "
                                    + "ID vacío."
                    );

                    continue;
                }


                if (
                        catalogoEjercicioRepository
                                .existsBySourceId(
                                        sourceId
                                )
                ) {

                    existentes++;

                    continue;
                }


                CatalogoEjercicio ejercicio =
                        new CatalogoEjercicio();


                ejercicio.setSourceId(
                        sourceId
                );


                ejercicio.setNombreOriginal(
                        obtenerTexto(
                                nodo,
                                "nombreOriginal"
                        )
                );


                ejercicio.setNombre(
                        obtenerTexto(
                                nodo,
                                "nombre"
                        )
                );


                ejercicio.setGrupoFitTrack(
                        obtenerTexto(
                                nodo,
                                "grupoFitTrack"
                        )
                );


                ejercicio.setEquipamiento(
                        obtenerTexto(
                                nodo,
                                "equipamiento"
                        )
                );


                ejercicio.setMusculoPrincipal(
                        obtenerTexto(
                                nodo,
                                "musculoPrincipal"
                        )
                );


                ejercicio.setMusculosPrincipales(
                        obtenerLista(
                                nodo,
                                "musculosPrincipales"
                        )
                );


                ejercicio.setMusculosSecundarios(
                        obtenerLista(
                                nodo,
                                "musculosSecundarios"
                        )
                );


                ejercicio.setInstruccionesOriginales(
                        obtenerLista(
                                nodo,
                                "instruccionesOriginales"
                        )
                );


                ejercicio.setInstrucciones(
                        obtenerLista(
                                nodo,
                                "instrucciones"
                        )
                );


                ejercicio.setFuerza(
                        obtenerTexto(
                                nodo,
                                "fuerza"
                        )
                );


                ejercicio.setNivel(
                        obtenerTexto(
                                nodo,
                                "nivel"
                        )
                );


                ejercicio.setMecanica(
                        obtenerTexto(
                                nodo,
                                "mecanica"
                        )
                );


                ejercicio.setCategoria(
                        obtenerTexto(
                                nodo,
                                "categoria"
                        )
                );


                nuevos.add(
                        ejercicio
                );
            }
        }


        if (!nuevos.isEmpty()) {

            catalogoEjercicioRepository
                    .saveAll(
                            nuevos
                    );
        }


        System.out.println(
                "Ejercicios encontrados: "
                        + encontrados
        );

        System.out.println(
                "Ya existentes: "
                        + existentes
        );

        System.out.println(
                "Nuevos importados: "
                        + nuevos.size()
        );

        System.out.println(
                "Total en PostgreSQL: "
                        + catalogoEjercicioRepository.count()
        );

        System.out.println(
                "===================================="
        );

        System.out.println("");
    }


    private String obtenerTexto(
            JsonNode nodo,
            String campo
    ) {

        JsonNode valor =
                nodo.get(
                        campo
                );


        if (
                valor == null
                        || valor.isNull()
        ) {

            return null;
        }


        return valor.asText();
    }


    private List<String> obtenerLista(
            JsonNode nodo,
            String campo
    ) {

        List<String> resultado =
                new ArrayList<>();


        JsonNode lista =
                nodo.get(
                        campo
                );


        if (
                lista == null
                        || !lista.isArray()
        ) {

            return resultado;
        }


        for (JsonNode elemento : lista) {

            if (
                    elemento != null
                            && !elemento.isNull()
            ) {

                resultado.add(
                        elemento.asText()
                );
            }
        }


        return resultado;
    }
}