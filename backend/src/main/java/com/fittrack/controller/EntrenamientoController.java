package com.fittrack.controller;

import com.fittrack.dto.AnalisisEntrenamientoIaResponse;
import com.fittrack.dto.EntrenamientoAnalisisResponse;
import com.fittrack.dto.EstadisticasUsuarioResponse;
import com.fittrack.dto.HistorialEntrenamientoResponse;
import com.fittrack.dto.ResumenEntrenamientoResponse;
import com.fittrack.dto.EntrenamientoUpdateRequest;
import com.fittrack.model.Entrenamiento;
import com.fittrack.model.Usuario;
import com.fittrack.security.JwtService;
import com.fittrack.service.EntrenamientoService;
import com.fittrack.service.OpenAiService;
import com.fittrack.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/entrenamientos")
public class EntrenamientoController {

    private final EntrenamientoService entrenamientoService;
    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final OpenAiService openAiService;


    public EntrenamientoController(
            EntrenamientoService entrenamientoService,
            UsuarioService usuarioService,
            JwtService jwtService,
            OpenAiService openAiService
    ) {
        this.entrenamientoService = entrenamientoService;
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.openAiService = openAiService;
    }


    // CREAR ENTRENAMIENTO

    @PostMapping
    public ResponseEntity<?> crearEntrenamiento(
            @RequestHeader("Authorization") String authorization,
            @RequestBody EntrenamientoRequest request
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        if (request == null
                || request.getNombre() == null
                || request.getNombre().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Debes indicar el nombre del entrenamiento");
        }

        if (request.getDuracionMinutos() != null
                && request.getDuracionMinutos() < 0) {

            return ResponseEntity.badRequest()
                    .body("La duración no puede ser negativa");
        }

        Entrenamiento entrenamiento =
                new Entrenamiento();

        entrenamiento.setNombre(
                request.getNombre().trim()
        );

        entrenamiento.setDuracionMinutos(
                request.getDuracionMinutos()
        );

        if (request.getFecha() == null) {

            entrenamiento.setFecha(
                    LocalDate.now()
            );

        } else {

            entrenamiento.setFecha(
                    request.getFecha()
            );
        }

        entrenamiento.setUsuario(
                usuario
        );

        Entrenamiento guardado =
                entrenamientoService
                        .guardarEntrenamiento(entrenamiento);

        return ResponseEntity.ok(
                convertirARespuesta(guardado)
        );
    }


    // EDITAR ENTRENAMIENTO

    @PutMapping("/{entrenamientoId}")
    public ResponseEntity<?> editarEntrenamiento(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long entrenamientoId,
            @RequestBody EntrenamientoUpdateRequest request
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        Entrenamiento entrenamiento =
                entrenamientoService
                        .buscarPorId(entrenamientoId)
                        .orElse(null);

        if (entrenamiento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!entrenamientoService.perteneceUsuario(
                entrenamiento,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }

        if (request == null) {

            return ResponseEntity.badRequest()
                    .body("Debes indicar los datos a modificar");
        }

        if (request.getNombre() == null
                && request.getFecha() == null
                && request.getDuracionMinutos() == null) {

            return ResponseEntity.badRequest()
                    .body("Debes indicar al menos un campo a modificar");
        }

        if (request.getNombre() != null
                && request.getNombre().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("El nombre no puede estar vacío");
        }

        if (request.getDuracionMinutos() != null
                && request.getDuracionMinutos() < 0) {

            return ResponseEntity.badRequest()
                    .body("La duración no puede ser negativa");
        }

        if (request.getNombre() != null) {

            entrenamiento.setNombre(
                    request.getNombre().trim()
            );
        }

        if (request.getFecha() != null) {

            entrenamiento.setFecha(
                    request.getFecha()
            );
        }

        if (request.getDuracionMinutos() != null) {

            entrenamiento.setDuracionMinutos(
                    request.getDuracionMinutos()
            );
        }

        Entrenamiento actualizado =
                entrenamientoService
                        .guardarEntrenamiento(entrenamiento);

        return ResponseEntity.ok(
                convertirARespuesta(actualizado)
        );
    }


    // ELIMINAR ENTRENAMIENTO

    @DeleteMapping("/{entrenamientoId}")
    public ResponseEntity<?> eliminarEntrenamiento(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long entrenamientoId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        Entrenamiento entrenamiento =
                entrenamientoService
                        .buscarPorId(entrenamientoId)
                        .orElse(null);

        if (entrenamiento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!entrenamientoService.perteneceUsuario(
                entrenamiento,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }

        entrenamientoService.eliminarEntrenamiento(
                entrenamientoId
        );

        return ResponseEntity.noContent().build();
    }


    // OBTENER ENTRENAMIENTOS DEL USUARIO

    @GetMapping
    public ResponseEntity<?> obtenerEntrenamientosUsuario(
            @RequestHeader("Authorization") String authorization
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        List<EntrenamientoResponse> respuesta =
                entrenamientoService
                        .obtenerPorUsuario(usuario.getId())
                        .stream()
                        .map(this::convertirARespuesta)
                        .toList();

        return ResponseEntity.ok(respuesta);
    }


    // OBTENER HISTORIAL GENERAL DEL USUARIO

    @GetMapping("/historial")
    public ResponseEntity<?> obtenerHistorialUsuario(
            @RequestHeader("Authorization") String authorization
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        List<HistorialEntrenamientoResponse> historial =
                entrenamientoService.obtenerHistorialUsuario(
                        usuario.getId()
                );

        return ResponseEntity.ok(historial);
    }


    // OBTENER ESTADÍSTICAS GENERALES DEL USUARIO

    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticasUsuario(
            @RequestHeader("Authorization") String authorization
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        EstadisticasUsuarioResponse respuesta =
                entrenamientoService.obtenerEstadisticasUsuario(
                        usuario.getId()
                );

        return ResponseEntity.ok(respuesta);
    }


    // OBTENER UN ENTRENAMIENTO POR ID

    @GetMapping("/{entrenamientoId}")
    public ResponseEntity<?> obtenerEntrenamiento(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long entrenamientoId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        Entrenamiento entrenamiento =
                entrenamientoService
                        .buscarPorId(entrenamientoId)
                        .orElse(null);

        if (entrenamiento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!entrenamientoService.perteneceUsuario(
                entrenamiento,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(
                convertirARespuesta(entrenamiento)
        );
    }


    // OBTENER RESUMEN COMPLETO DEL ENTRENAMIENTO

    @GetMapping("/{entrenamientoId}/resumen")
    public ResponseEntity<?> obtenerResumenEntrenamiento(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long entrenamientoId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        Entrenamiento entrenamiento =
                entrenamientoService
                        .buscarPorId(entrenamientoId)
                        .orElse(null);

        if (entrenamiento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!entrenamientoService.perteneceUsuario(
                entrenamiento,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }

        ResumenEntrenamientoResponse respuesta =
                entrenamientoService
                        .obtenerResumenEntrenamiento(
                                entrenamientoId
                        );

        return ResponseEntity.ok(respuesta);
    }


    // OBTENER DATOS COMPLETOS PARA ANÁLISIS DEL ENTRENAMIENTO

    @GetMapping("/{entrenamientoId}/analisis")
    public ResponseEntity<?> obtenerAnalisisEntrenamiento(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long entrenamientoId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        Entrenamiento entrenamiento =
                entrenamientoService
                        .buscarPorId(entrenamientoId)
                        .orElse(null);

        if (entrenamiento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!entrenamientoService.perteneceUsuario(
                entrenamiento,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }

        EntrenamientoAnalisisResponse respuesta =
                entrenamientoService
                        .obtenerAnalisisEntrenamiento(
                                entrenamientoId
                        );

        if (respuesta == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(respuesta);
    }


    // ANALIZAR ENTRENAMIENTO CON IA

    @PostMapping("/{entrenamientoId}/analizar-ia")
    public ResponseEntity<?> analizarEntrenamientoConIa(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long entrenamientoId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        Entrenamiento entrenamiento =
                entrenamientoService
                        .buscarPorId(entrenamientoId)
                        .orElse(null);

        if (entrenamiento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!entrenamientoService.perteneceUsuario(
                entrenamiento,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }

        EntrenamientoAnalisisResponse datosEntrenamiento =
                entrenamientoService
                        .obtenerAnalisisEntrenamiento(
                                entrenamientoId
                        );

        if (datosEntrenamiento == null) {
            return ResponseEntity.notFound().build();
        }

        try {

            String analisis =
                    openAiService
                            .analizarEntrenamiento(
                                    datosEntrenamiento
                            );

            AnalisisEntrenamientoIaResponse respuesta =
                    new AnalisisEntrenamientoIaResponse(
                            entrenamiento.getId(),
                            entrenamiento.getNombre(),
                            analisis
                    );

            return ResponseEntity.ok(respuesta);

        } catch (IllegalStateException e) {

            return ResponseEntity.status(503)
                    .body(
                            "El servicio de análisis con IA no está disponible en este momento"
                    );
        }
    }


    // OBTENER USUARIO DESDE TOKEN

    private Usuario obtenerUsuarioDesdeToken(
            String authorization
    ) {

        try {

            if (authorization == null
                    || !authorization.startsWith("Bearer ")) {

                return null;
            }

            String token =
                    authorization.substring(7);

            String email =
                    jwtService.obtenerEmail(token);

            return usuarioService
                    .buscarUsuarioPorEmail(email);

        } catch (Exception e) {

            return null;
        }
    }


    // CONVERTIR A RESPUESTA

    private EntrenamientoResponse convertirARespuesta(
            Entrenamiento entrenamiento
    ) {

        return new EntrenamientoResponse(
                entrenamiento.getId(),
                entrenamiento.getNombre(),
                entrenamiento.getFecha(),
                entrenamiento.getDuracionMinutos()
        );
    }


    // REQUEST DE CREACIÓN

    public static class EntrenamientoRequest {

        private String nombre;
        private LocalDate fecha;
        private Integer duracionMinutos;


        public EntrenamientoRequest() {
        }


        public String getNombre() {
            return nombre;
        }


        public void setNombre(String nombre) {
            this.nombre = nombre;
        }


        public LocalDate getFecha() {
            return fecha;
        }


        public void setFecha(LocalDate fecha) {
            this.fecha = fecha;
        }


        public Integer getDuracionMinutos() {
            return duracionMinutos;
        }


        public void setDuracionMinutos(
                Integer duracionMinutos
        ) {
            this.duracionMinutos = duracionMinutos;
        }
    }


    // RESPUESTA

    public static class EntrenamientoResponse {

        private Long id;
        private String nombre;
        private LocalDate fecha;
        private Integer duracionMinutos;


        public EntrenamientoResponse() {
        }


        public EntrenamientoResponse(
                Long id,
                String nombre,
                LocalDate fecha,
                Integer duracionMinutos
        ) {
            this.id = id;
            this.nombre = nombre;
            this.fecha = fecha;
            this.duracionMinutos = duracionMinutos;
        }


        public Long getId() {
            return id;
        }


        public void setId(Long id) {
            this.id = id;
        }


        public String getNombre() {
            return nombre;
        }


        public void setNombre(String nombre) {
            this.nombre = nombre;
        }


        public LocalDate getFecha() {
            return fecha;
        }


        public void setFecha(LocalDate fecha) {
            this.fecha = fecha;
        }


        public Integer getDuracionMinutos() {
            return duracionMinutos;
        }


        public void setDuracionMinutos(
                Integer duracionMinutos
        ) {
            this.duracionMinutos = duracionMinutos;
        }
    }
}