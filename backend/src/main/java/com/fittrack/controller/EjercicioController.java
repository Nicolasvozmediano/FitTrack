package com.fittrack.controller;

import com.fittrack.dto.EjercicioRequest;
import com.fittrack.model.CatalogoEjercicio;
import com.fittrack.model.Ejercicio;
import com.fittrack.model.Entrenamiento;
import com.fittrack.model.Usuario;
import com.fittrack.security.JwtService;
import com.fittrack.service.CatalogoEjercicioService;
import com.fittrack.service.EjercicioService;
import com.fittrack.service.EntrenamientoService;
import com.fittrack.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/ejercicios")
public class EjercicioController {

    private final EjercicioService ejercicioService;
    private final EntrenamientoService entrenamientoService;
    private final UsuarioService usuarioService;
    private final CatalogoEjercicioService catalogoEjercicioService;
    private final JwtService jwtService;


    public EjercicioController(
            EjercicioService ejercicioService,
            EntrenamientoService entrenamientoService,
            UsuarioService usuarioService,
            CatalogoEjercicioService catalogoEjercicioService,
            JwtService jwtService
    ) {
        this.ejercicioService = ejercicioService;
        this.entrenamientoService = entrenamientoService;
        this.usuarioService = usuarioService;
        this.catalogoEjercicioService =
                catalogoEjercicioService;
        this.jwtService = jwtService;
    }


    // CREAR EJERCICIO

    @PostMapping("/entrenamiento/{entrenamientoId}")
    public ResponseEntity<?> crearEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long entrenamientoId,
            @RequestBody EjercicioRequest request
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(
                        authorization
                );


        if (usuario == null) {
            return ResponseEntity
                    .status(401)
                    .build();
        }


        Entrenamiento entrenamiento =
                entrenamientoService
                        .buscarPorId(
                                entrenamientoId
                        )
                        .orElse(null);


        if (entrenamiento == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }


        if (!entrenamientoService.perteneceUsuario(
                entrenamiento,
                usuario.getId()
        )) {

            return ResponseEntity
                    .status(403)
                    .build();
        }


        if (request == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Debes indicar los datos del ejercicio"
                    );
        }


        CatalogoEjercicio catalogoEjercicio =
                null;


        if (request.getCatalogoEjercicioId() != null) {

            catalogoEjercicio =
                    catalogoEjercicioService
                            .buscarPorId(
                                    request.getCatalogoEjercicioId()
                            )
                            .orElse(null);


            if (catalogoEjercicio == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "El ejercicio del catálogo no existe"
                        );
            }
        }


        String nombreEjercicio;


        if (catalogoEjercicio != null) {

            nombreEjercicio =
                    catalogoEjercicio.getNombre();

        } else {

            if (
                    request.getNombre() == null
                            || request.getNombre().isBlank()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Debes indicar el nombre del ejercicio"
                        );
            }


            nombreEjercicio =
                    request.getNombre().trim();
        }


        Ejercicio ejercicio =
                new Ejercicio();


        ejercicio.setNombre(
                nombreEjercicio
        );


        ejercicio.setEntrenamiento(
                entrenamiento
        );


        ejercicio.setCatalogoEjercicio(
                catalogoEjercicio
        );


        Ejercicio guardado =
                ejercicioService
                        .guardarEjercicio(
                                ejercicio
                        );


        return ResponseEntity.ok(
                new EjercicioSimpleResponse(
                        guardado.getId(),
                        guardado.getNombre(),
                        obtenerCatalogoEjercicioId(
                                guardado
                        )
                )
        );
    }


    // EDITAR EJERCICIO

    @PutMapping("/{ejercicioId}")
    public ResponseEntity<?> editarEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId,
            @RequestBody EjercicioRequest request
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(
                        authorization
                );


        if (usuario == null) {
            return ResponseEntity
                    .status(401)
                    .build();
        }


        Ejercicio ejercicio =
                ejercicioService
                        .buscarPorId(
                                ejercicioId
                        )
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }


        if (
                ejercicio.getEntrenamiento() == null
                        || !entrenamientoService
                        .perteneceUsuario(
                                ejercicio.getEntrenamiento(),
                                usuario.getId()
                        )
        ) {

            return ResponseEntity
                    .status(403)
                    .build();
        }


        if (
                request == null
                        || request.getNombre() == null
                        || request.getNombre().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Debes indicar el nombre del ejercicio"
                    );
        }


        ejercicio.setNombre(
                request.getNombre().trim()
        );


        Ejercicio actualizado =
                ejercicioService
                        .guardarEjercicio(
                                ejercicio
                        );


        return ResponseEntity.ok(
                new EjercicioSimpleResponse(
                        actualizado.getId(),
                        actualizado.getNombre(),
                        obtenerCatalogoEjercicioId(
                                actualizado
                        )
                )
        );
    }


    // ELIMINAR EJERCICIO

    @DeleteMapping("/{ejercicioId}")
    public ResponseEntity<?> eliminarEjercicio(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long ejercicioId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(
                        authorization
                );


        if (usuario == null) {
            return ResponseEntity
                    .status(401)
                    .build();
        }


        Ejercicio ejercicio =
                ejercicioService
                        .buscarPorId(
                                ejercicioId
                        )
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }


        if (
                ejercicio.getEntrenamiento() == null
                        || !entrenamientoService
                        .perteneceUsuario(
                                ejercicio.getEntrenamiento(),
                                usuario.getId()
                        )
        ) {

            return ResponseEntity
                    .status(403)
                    .build();
        }


        ejercicioService
                .eliminarEjercicio(
                        ejercicioId
                );


        return ResponseEntity
                .noContent()
                .build();
    }


    // OBTENER EJERCICIOS DE UN ENTRENAMIENTO

    @GetMapping("/entrenamiento/{entrenamientoId}")
    public ResponseEntity<?> obtenerEjercicios(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long entrenamientoId
    ) {

        Usuario usuario =
                obtenerUsuarioDesdeToken(
                        authorization
                );


        if (usuario == null) {
            return ResponseEntity
                    .status(401)
                    .build();
        }


        Entrenamiento entrenamiento =
                entrenamientoService
                        .buscarPorId(
                                entrenamientoId
                        )
                        .orElse(null);


        if (entrenamiento == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }


        if (!entrenamientoService.perteneceUsuario(
                entrenamiento,
                usuario.getId()
        )) {

            return ResponseEntity
                    .status(403)
                    .build();
        }


        List<EjercicioSimpleResponse> respuesta =
                entrenamiento
                        .getEjercicios()
                        .stream()
                        .map(
                                ejercicio ->
                                        new EjercicioSimpleResponse(
                                                ejercicio.getId(),
                                                ejercicio.getNombre(),
                                                obtenerCatalogoEjercicioId(
                                                        ejercicio
                                                )
                                        )
                        )
                        .toList();


        return ResponseEntity.ok(
                respuesta
        );
    }


    // OBTENER ID DEL CATÁLOGO SI EXISTE

    private Long obtenerCatalogoEjercicioId(
            Ejercicio ejercicio
    ) {

        if (
                ejercicio.getCatalogoEjercicio()
                        == null
        ) {

            return null;
        }


        return ejercicio
                .getCatalogoEjercicio()
                .getId();
    }


    // OBTENER USUARIO DESDE JWT

    private Usuario obtenerUsuarioDesdeToken(
            String authorization
    ) {

        try {

            if (
                    authorization == null
                            || !authorization.startsWith(
                            "Bearer "
                    )
            ) {

                return null;
            }


            String token =
                    authorization.substring(7);


            String email =
                    jwtService.obtenerEmail(
                            token
                    );


            return usuarioService
                    .buscarUsuarioPorEmail(
                            email
                    );

        } catch (Exception e) {

            return null;
        }
    }


    // RESPUESTA LIMPIA DEL EJERCICIO

    public static class EjercicioSimpleResponse {

        private Long id;
        private String nombre;
        private Long catalogoEjercicioId;


        public EjercicioSimpleResponse() {
        }


        public EjercicioSimpleResponse(
                Long id,
                String nombre,
                Long catalogoEjercicioId
        ) {
            this.id = id;
            this.nombre = nombre;
            this.catalogoEjercicioId =
                    catalogoEjercicioId;
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


        public Long getCatalogoEjercicioId() {
            return catalogoEjercicioId;
        }


        public void setCatalogoEjercicioId(
                Long catalogoEjercicioId
        ) {
            this.catalogoEjercicioId =
                    catalogoEjercicioId;
        }
    }
}