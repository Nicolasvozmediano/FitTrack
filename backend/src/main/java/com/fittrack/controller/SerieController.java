package com.fittrack.controller;

import com.fittrack.dto.EstadisticasEjercicioResponse;
import com.fittrack.dto.HistorialSesionEjercicioResponse;
import com.fittrack.dto.ProgresoEjercicioResponse;
import com.fittrack.dto.ProgresoSesionEjercicioResponse;
import com.fittrack.dto.RecordEjercicioResponse;
import com.fittrack.dto.SerieResponse;
import com.fittrack.model.Ejercicio;
import com.fittrack.model.Serie;
import com.fittrack.model.Usuario;
import com.fittrack.repository.EjercicioRepository;
import com.fittrack.security.JwtService;
import com.fittrack.service.SerieService;
import com.fittrack.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/series")
public class SerieController {

    private final SerieService serieService;
    private final EjercicioRepository ejercicioRepository;
    private final UsuarioService usuarioService;
    private final JwtService jwtService;


    public SerieController(
            SerieService serieService,
            EjercicioRepository ejercicioRepository,
            UsuarioService usuarioService,
            JwtService jwtService
    ) {
        this.serieService = serieService;
        this.ejercicioRepository = ejercicioRepository;
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }


    // CREAR SERIE

    @PostMapping("/ejercicio/{ejercicioId}")
    public ResponseEntity<?> crearSerie(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId,
            @RequestBody SerieRequest request
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity.notFound().build();
        }


        if (!ejercicioPerteneceUsuario(
                ejercicio,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }


        String errorValidacion =
                validarSerieRequest(request);


        if (errorValidacion != null) {

            return ResponseEntity
                    .badRequest()
                    .body(errorValidacion);
        }


        Serie serie =
                new Serie();


        serie.setPeso(
                request.getPeso()
        );


        serie.setRepeticiones(
                request.getRepeticiones()
        );


        serie.setFecha(
                LocalDate.now()
        );


        serie.setEjercicio(
                ejercicio
        );


        Serie guardada =
                serieService.guardarSerie(serie);


        return ResponseEntity.ok(
                convertirARespuesta(guardada)
        );
    }


    // EDITAR SERIE

    @PutMapping("/{serieId}")
    public ResponseEntity<?> editarSerie(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long serieId,
            @RequestBody SerieRequest request
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Serie serie =
                serieService
                        .buscarPorId(serieId)
                        .orElse(null);


        if (serie == null) {
            return ResponseEntity.notFound().build();
        }


        if (serie.getEjercicio() == null
                || !ejercicioPerteneceUsuario(
                        serie.getEjercicio(),
                        usuario.getId()
                )) {

            return ResponseEntity.status(403).build();
        }


        String errorValidacion =
                validarSerieRequest(request);


        if (errorValidacion != null) {

            return ResponseEntity
                    .badRequest()
                    .body(errorValidacion);
        }


        serie.setPeso(
                request.getPeso()
        );


        serie.setRepeticiones(
                request.getRepeticiones()
        );


        Serie actualizada =
                serieService.guardarSerie(serie);


        return ResponseEntity.ok(
                convertirARespuesta(actualizada)
        );
    }


    // ELIMINAR SERIE

    @DeleteMapping("/{serieId}")
    public ResponseEntity<?> eliminarSerie(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long serieId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Serie serie =
                serieService
                        .buscarPorId(serieId)
                        .orElse(null);


        if (serie == null) {
            return ResponseEntity.notFound().build();
        }


        if (serie.getEjercicio() == null
                || !ejercicioPerteneceUsuario(
                        serie.getEjercicio(),
                        usuario.getId()
                )) {

            return ResponseEntity.status(403).build();
        }


        serieService.eliminarSerie(
                serieId
        );


        return ResponseEntity.noContent().build();
    }


    // OBTENER SERIES DE UN EJERCICIO

    @GetMapping("/ejercicio/{ejercicioId}")
    public ResponseEntity<?> obtenerSeriesEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity.notFound().build();
        }


        if (!ejercicioPerteneceUsuario(
                ejercicio,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }


        List<SerieResponse> respuesta =
                serieService
                        .obtenerSeriesEjercicio(ejercicioId)
                        .stream()
                        .map(this::convertirARespuesta)
                        .toList();


        return ResponseEntity.ok(respuesta);
    }


    // HISTORIAL DE UN EJERCICIO CONCRETO

    @GetMapping("/historial/ejercicio/{ejercicioId}")
    public ResponseEntity<?> obtenerHistorialEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity.notFound().build();
        }


        if (!ejercicioPerteneceUsuario(
                ejercicio,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }


        List<SerieResponse> respuesta =
                serieService
                        .obtenerHistorialEjercicio(ejercicioId)
                        .stream()
                        .map(this::convertirARespuesta)
                        .toList();


        return ResponseEntity.ok(respuesta);
    }


    // HISTORIAL COMPLETO DEL MISMO EJERCICIO ENTRE SESIONES

    @GetMapping("/historial-sesiones/ejercicio/{ejercicioId}")
    public ResponseEntity<?> obtenerHistorialEntreSesiones(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity.notFound().build();
        }


        if (!ejercicioPerteneceUsuario(
                ejercicio,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }


        List<HistorialSesionEjercicioResponse> respuesta =
                serieService
                        .obtenerHistorialEntreSesiones(
                                ejercicioId
                        );


        return ResponseEntity.ok(
                respuesta
        );
    }


    // ESTADÍSTICAS DEL EJERCICIO

    @GetMapping("/estadisticas/ejercicio/{ejercicioId}")
    public ResponseEntity<?> obtenerEstadisticasEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity.notFound().build();
        }


        if (!ejercicioPerteneceUsuario(
                ejercicio,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }


        EstadisticasEjercicioResponse respuesta =
                serieService
                        .obtenerEstadisticasEjercicio(ejercicioId);


        return ResponseEntity.ok(respuesta);
    }


    // RÉCORD DEL EJERCICIO

    @GetMapping("/record/ejercicio/{ejercicioId}")
    public ResponseEntity<?> obtenerRecordEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity.notFound().build();
        }


        if (!ejercicioPerteneceUsuario(
                ejercicio,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }


        RecordEjercicioResponse respuesta =
                serieService
                        .obtenerRecordEjercicio(ejercicioId);


        return ResponseEntity.ok(respuesta);
    }


    // PROGRESO ENTRE LAS DOS ÚLTIMAS SERIES

    @GetMapping("/progreso/ejercicio/{ejercicioId}")
    public ResponseEntity<?> obtenerProgresoEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity.notFound().build();
        }


        if (!ejercicioPerteneceUsuario(
                ejercicio,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }


        ProgresoEjercicioResponse respuesta =
                serieService
                        .obtenerProgresoEjercicio(ejercicioId);


        return ResponseEntity.ok(respuesta);
    }


    // PROGRESO ENTRE SESIONES

    @GetMapping("/progreso-sesion/ejercicio/{ejercicioId}")
    public ResponseEntity<?> obtenerProgresoSesionEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        Ejercicio ejercicio =
                ejercicioRepository
                        .findById(ejercicioId)
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity.notFound().build();
        }


        if (!ejercicioPerteneceUsuario(
                ejercicio,
                usuario.getId()
        )) {

            return ResponseEntity.status(403).build();
        }


        ProgresoSesionEjercicioResponse respuesta =
                serieService
                        .obtenerProgresoEntreSesiones(
                                ejercicioId
                        );


        if (respuesta == null) {
            return ResponseEntity.notFound().build();
        }


        return ResponseEntity.ok(respuesta);
    }


    // OBTENER TODAS LAS SERIES DEL USUARIO AUTENTICADO

    @GetMapping
    public ResponseEntity<?> obtenerTodas(
            @RequestHeader("Authorization") String authorization
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(authorization);


        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }


        List<SerieResponse> respuesta =
                serieService
                        .obtenerPorUsuario(usuario.getId())
                        .stream()
                        .map(this::convertirARespuesta)
                        .toList();


        return ResponseEntity.ok(respuesta);
    }


    // VALIDAR SERIE

    private String validarSerieRequest(
            SerieRequest request
    ) {

        if (request == null
                || request.getPeso() == null
                || request.getRepeticiones() == null) {

            return "Debes indicar peso y repeticiones";
        }


        if (request.getPeso() < 0) {

            return "El peso no puede ser negativo";
        }


        if (request.getRepeticiones() <= 0) {

            return "Las repeticiones deben ser mayores que 0";
        }


        return null;
    }


    // COMPROBAR PROPIETARIO DEL EJERCICIO

    private boolean ejercicioPerteneceUsuario(
            Ejercicio ejercicio,
            Long usuarioId
    ) {

        if (ejercicio == null
                || ejercicio.getEntrenamiento() == null
                || ejercicio.getEntrenamiento().getUsuario() == null
                || ejercicio.getEntrenamiento().getUsuario().getId() == null
                || usuarioId == null) {

            return false;
        }


        return ejercicio
                .getEntrenamiento()
                .getUsuario()
                .getId()
                .equals(usuarioId);
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


    // CONVERTIR SERIE A DTO

    private SerieResponse convertirARespuesta(
            Serie serie
    ) {

        return new SerieResponse(
                serie.getId(),
                serie.getPeso(),
                serie.getRepeticiones(),
                serie.getFecha()
        );
    }


    // REQUEST DE SERIE

    public static class SerieRequest {

        private Double peso;
        private Integer repeticiones;


        public SerieRequest() {
        }


        public Double getPeso() {
            return peso;
        }


        public void setPeso(
                Double peso
        ) {
            this.peso = peso;
        }


        public Integer getRepeticiones() {
            return repeticiones;
        }


        public void setRepeticiones(
                Integer repeticiones
        ) {
            this.repeticiones = repeticiones;
        }
    }
}