package com.fittrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fittrack.dto.EntrenamientoAnalisisResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.Map;


@Service
public class OpenAiService {

    private final ObjectMapper objectMapper;
    private final RestClient restClient;


    @Value("${openai.api-key:}")
    private String apiKey;


    @Value("${openai.model:gpt-5.6}")
    private String modelo;


    public OpenAiService(
            ObjectMapper objectMapper
    ) {

        this.objectMapper = objectMapper;

        this.restClient =
                RestClient.builder()
                        .baseUrl("https://api.openai.com")
                        .build();
    }


    // ANALIZAR UN ENTRENAMIENTO CON OPENAI

    public String analizarEntrenamiento(
            EntrenamientoAnalisisResponse entrenamiento
    ) {

        if (entrenamiento == null) {

            throw new IllegalArgumentException(
                    "El entrenamiento no puede ser nulo"
            );
        }


        comprobarApiKey();


        try {

            String datosEntrenamiento =
                    objectMapper
                            .writerWithDefaultPrettyPrinter()
                            .writeValueAsString(entrenamiento);


            String instrucciones =
                    """
                    Eres el asistente de entrenamiento de FitTrack.

                    Analiza exclusivamente los datos del entrenamiento
                    que recibes. No inventes pesos, repeticiones,
                    ejercicios, volumen ni información que no aparezca
                    en los datos.

                    Tu respuesta debe estar en español y ser clara,
                    breve y útil para una persona que entrena en gimnasio.

                    No realices diagnósticos médicos ni afirmaciones
                    sobre lesiones o enfermedades.

                    Analiza aspectos como:

                    - volumen total de entrenamiento;
                    - número de ejercicios y series;
                    - repeticiones realizadas;
                    - pesos utilizados;
                    - peso máximo registrado;
                    - distribución general del trabajo;
                    - posibles puntos positivos;
                    - aspectos que podrían mejorarse en futuras sesiones.

                    Devuelve exactamente estas cuatro secciones:

                    RESUMEN
                    Un resumen corto del entrenamiento.

                    PUNTOS POSITIVOS
                    Entre 1 y 3 puntos concretos basados en los datos.

                    A MEJORAR
                    Entre 1 y 3 aspectos concretos. Si los datos son
                    insuficientes para afirmarlo, indícalo.

                    PRÓXIMA SESIÓN
                    Una recomendación práctica y prudente para la
                    siguiente sesión.

                    No uses tablas.
                    No añadas información inventada.
                    """;


            String entrada =
                    """
                    Analiza este entrenamiento registrado en FitTrack:

                    %s
                    """.formatted(datosEntrenamiento);


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
                    900
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
                    extraerTextoRespuesta(respuesta);


            if (texto == null || texto.isBlank()) {

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


    // COMPROBAR QUE EXISTE API KEY

    private void comprobarApiKey() {

        if (apiKey == null || apiKey.isBlank()) {

            throw new IllegalStateException(
                    "OPENAI_API_KEY no está configurada"
            );
        }
    }


    // EXTRAER TEXTO DE LA RESPUESTA

    private String extraerTextoRespuesta(
            JsonNode respuesta
    ) {

        if (respuesta == null) {

            return null;
        }


        JsonNode output =
                respuesta.path("output");


        if (!output.isArray()) {

            return null;
        }


        StringBuilder texto =
                new StringBuilder();


        for (JsonNode item : output) {

            if (!"message".equals(
                    item.path("type").asText()
            )) {

                continue;
            }


            JsonNode contenido =
                    item.path("content");


            if (!contenido.isArray()) {

                continue;
            }


            for (JsonNode parte : contenido) {

                if (!"output_text".equals(
                        parte.path("type").asText()
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


                texto.append(fragmento);
            }
        }


        return texto.toString();
    }
}