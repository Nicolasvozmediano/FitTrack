package com.fittrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fittrack.dto.EjercicioAnalisisResponse;
import com.fittrack.dto.EntrenamientoAnalisisResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Service
public class OpenAiService {

    private final ObjectMapper objectMapper;
    private final RestClient restClient;


    @Value("${openai.api-key:}")
    private String apiKey;


    @Value("${openai.model:gpt-5.6}")
    private String modelo;


    @Value("${openai.enabled:false}")
    private boolean openAiEnabled;


    public OpenAiService(
            ObjectMapper objectMapper
    ) {

        this.objectMapper = objectMapper;

        this.restClient =
                RestClient.builder()
                        .baseUrl("https://api.openai.com")
                        .build();
    }


    // ANALIZAR ENTRENAMIENTO

    public String analizarEntrenamiento(
            EntrenamientoAnalisisResponse entrenamiento
    ) {

        if (entrenamiento == null) {

            throw new IllegalArgumentException(
                    "El entrenamiento no puede ser nulo"
            );
        }


        /*
         * MODO DESARROLLO GRATUITO
         */

        if (!openAiEnabled) {

            return generarAnalisisSimulado(
                    entrenamiento
            );
        }


        /*
         * MODO OPENAI REAL
         */

        comprobarApiKey();


        try {

            String datosEntrenamiento =
                    objectMapper
                            .writerWithDefaultPrettyPrinter()
                            .writeValueAsString(
                                    entrenamiento
                            );


            String instrucciones =
                    """
                    Eres el asistente de entrenamiento de FitTrack.

                    Analiza exclusivamente los datos del entrenamiento
                    que recibes.

                    No inventes pesos, repeticiones, ejercicios,
                    volumen ni información que no aparezca
                    en los datos.

                    Tu respuesta debe estar en español, ser directa,
                    breve y fácil de leer en una pantalla de móvil.

                    No realices diagnósticos médicos ni afirmaciones
                    sobre lesiones o enfermedades.

                    Devuelve exactamente estas cuatro secciones:

                    RESUMEN
                    Una sola frase corta.

                    PUNTOS POSITIVOS
                    Máximo 2 puntos breves.

                    A MEJORAR
                    Máximo 2 puntos breves. Si faltan datos,
                    indícalo de forma corta.

                    PRÓXIMA SESIÓN
                    Una sola recomendación práctica de máximo
                    dos frases.

                    No uses tablas.
                    No repitas información.
                    No añadas información inventada.
                    """;


            String entrada =
                    """
                    Analiza este entrenamiento registrado en FitTrack:

                    %s
                    """.formatted(
                            datosEntrenamiento
                    );


            Map<String, Object> body =
                    new LinkedHashMap<>();


            body.put(
                    "model",
                    modelo
            );


            body.put(
                    "instructions",
                    instrucciones
            );


            body.put(
                    "input",
                    entrada
            );


            body.put(
                    "max_output_tokens",
                    450
            );


            JsonNode respuesta =
                    restClient
                            .post()
                            .uri("/v1/responses")
                            .header(
                                    HttpHeaders.AUTHORIZATION,
                                    "Bearer " + apiKey
                            )
                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )
                            .body(body)
                            .retrieve()
                            .body(JsonNode.class);


            String texto =
                    extraerTextoRespuesta(
                            respuesta
                    );


            if (texto == null
                    || texto.isBlank()) {

                throw new IllegalStateException(
                        "OpenAI no devolvió texto de análisis"
                );
            }


            return texto.trim();


        } catch (Exception e) {

            if (e instanceof IllegalStateException) {

                throw (IllegalStateException) e;
            }


            throw new IllegalStateException(
                    "No se pudo analizar el entrenamiento con IA",
                    e
            );
        }
    }


    // GENERAR ANÁLISIS SIMULADO GRATUITO

    private String generarAnalisisSimulado(
            EntrenamientoAnalisisResponse entrenamiento
    ) {

        int totalEjercicios =
                entrenamiento.getTotalEjercicios() != null
                        ? entrenamiento.getTotalEjercicios()
                        : 0;


        int totalSeries =
                entrenamiento.getTotalSeries() != null
                        ? entrenamiento.getTotalSeries()
                        : 0;


        int totalRepeticiones =
                entrenamiento.getTotalRepeticiones() != null
                        ? entrenamiento.getTotalRepeticiones()
                        : 0;


        double volumenTotal =
                entrenamiento.getVolumenTotal() != null
                        ? entrenamiento.getVolumenTotal()
                        : 0.0;


        List<EjercicioAnalisisResponse> ejercicios =
                entrenamiento.getEjercicios();


        String ejercicioPrincipal =
                obtenerEjercicioConMayorPeso(
                        ejercicios
                );


        Double pesoMaximo =
                obtenerPesoMaximo(
                        ejercicios
                );


        StringBuilder analisis =
                new StringBuilder();


        analisis.append("RESUMEN\n");

        analisis.append(
                totalEjercicios
        );

        analisis.append(
                totalEjercicios == 1
                        ? " ejercicio · "
                        : " ejercicios · "
        );

        analisis.append(
                totalSeries
        );

        analisis.append(
                totalSeries == 1
                        ? " serie · "
                        : " series · "
        );

        analisis.append(
                totalRepeticiones
        );

        analisis.append(
                " reps · "
        );

        analisis.append(
                formatearNumero(
                        volumenTotal
                )
        );

        analisis.append(
                " kg de volumen."
        );


        analisis.append("\n\nPUNTOS POSITIVOS\n");

        analisis.append(
                "- Sesión registrada con peso y repeticiones."
        );


        if (pesoMaximo != null
                && ejercicioPrincipal != null) {

            analisis.append(
                    "\n- Máximo: "
            );

            analisis.append(
                    formatearNumero(
                            pesoMaximo
                    )
            );

            analisis.append(
                    " kg en "
            );

            analisis.append(
                    ejercicioPrincipal
            );

            analisis.append(".");
        }


        analisis.append("\n\nA MEJORAR\n");


        if (totalEjercicios <= 1) {

            analisis.append(
                    "- Registra más ejercicios para valorar mejor la sesión."
            );

        } else {

            analisis.append(
                    "- Mantén todas las series registradas para comparar el volumen."
            );
        }


        if (entrenamiento.getDuracionMinutos() == null) {

            analisis.append(
                    "\n- Añade la duración del entrenamiento."
            );
        }


        analisis.append("\n\nPRÓXIMA SESIÓN\n");

        analisis.append(
                "Compara peso y repeticiones con esta sesión. Si completas las mismas reps con buena técnica, valora una progresión gradual."
        );


        return analisis.toString();
    }


    // OBTENER EJERCICIO CON MAYOR PESO

    private String obtenerEjercicioConMayorPeso(
            List<EjercicioAnalisisResponse> ejercicios
    ) {

        if (ejercicios == null
                || ejercicios.isEmpty()) {

            return null;
        }


        EjercicioAnalisisResponse mejorEjercicio =
                null;


        for (EjercicioAnalisisResponse ejercicio : ejercicios) {

            if (ejercicio == null
                    || ejercicio.getPesoMaximo() == null) {

                continue;
            }


            if (mejorEjercicio == null
                    || mejorEjercicio.getPesoMaximo() == null
                    || ejercicio.getPesoMaximo()
                    > mejorEjercicio.getPesoMaximo()) {

                mejorEjercicio =
                        ejercicio;
            }
        }


        if (mejorEjercicio == null) {

            return null;
        }


        return mejorEjercicio.getNombre();
    }


    // OBTENER PESO MÁXIMO DE LA SESIÓN

    private Double obtenerPesoMaximo(
            List<EjercicioAnalisisResponse> ejercicios
    ) {

        if (ejercicios == null
                || ejercicios.isEmpty()) {

            return null;
        }


        Double pesoMaximo =
                null;


        for (EjercicioAnalisisResponse ejercicio : ejercicios) {

            if (ejercicio == null
                    || ejercicio.getPesoMaximo() == null) {

                continue;
            }


            if (pesoMaximo == null
                    || ejercicio.getPesoMaximo() > pesoMaximo) {

                pesoMaximo =
                        ejercicio.getPesoMaximo();
            }
        }


        return pesoMaximo;
    }


    // FORMATEAR NÚMEROS

    private String formatearNumero(
            double numero
    ) {

        if (numero == Math.rint(numero)) {

            return String.valueOf(
                    (long) numero
            );
        }


        return String.format(
                java.util.Locale.US,
                "%.2f",
                numero
        );
    }


    // COMPROBAR API KEY

    private void comprobarApiKey() {

        if (apiKey == null
                || apiKey.isBlank()) {

            throw new IllegalStateException(
                    "OPENAI_API_KEY no está configurada"
            );
        }
    }


    // EXTRAER TEXTO DE OPENAI

    private String extraerTextoRespuesta(
            JsonNode respuesta
    ) {

        if (respuesta == null) {

            return null;
        }


        JsonNode output =
                respuesta.path(
                        "output"
                );


        if (!output.isArray()) {

            return null;
        }


        StringBuilder texto =
                new StringBuilder();


        for (JsonNode item : output) {

            if (!"message".equals(
                    item.path("type")
                            .asText()
            )) {

                continue;
            }


            JsonNode contenido =
                    item.path(
                            "content"
                    );


            if (!contenido.isArray()) {

                continue;
            }


            for (JsonNode parte : contenido) {

                if (!"output_text".equals(
                        parte.path("type")
                                .asText()
                )) {

                    continue;
                }


                String fragmento =
                        parte.path("text")
                                .asText("");


                if (fragmento.isBlank()) {

                    continue;
                }


                if (texto.length() > 0) {

                    texto.append("\n");
                }


                texto.append(
                        fragmento
                );
            }
        }


        return texto.toString();
    }
}