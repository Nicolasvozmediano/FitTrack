package com.fittrack.controller;

import com.fittrack.model.CatalogoEjercicio;
import com.fittrack.model.Usuario;
import com.fittrack.security.JwtService;
import com.fittrack.service.CatalogoEjercicioService;
import com.fittrack.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;


@RestController
@RequestMapping("/api/catalogo-ejercicios")
public class CatalogoEjercicioController {

    private final CatalogoEjercicioService catalogoEjercicioService;
    private final UsuarioService usuarioService;
    private final JwtService jwtService;


    public CatalogoEjercicioController(
            CatalogoEjercicioService catalogoEjercicioService,
            UsuarioService usuarioService,
            JwtService jwtService
    ) {
        this.catalogoEjercicioService =
                catalogoEjercicioService;

        this.usuarioService =
                usuarioService;

        this.jwtService =
                jwtService;
    }


    // OBTENER CATÁLOGO COMPLETO CON FILTROS OPCIONALES

    @GetMapping
    public ResponseEntity<?> obtenerCatalogo(
            @RequestHeader("Authorization") String authorization,
            @RequestParam(required = false) String grupo,
            @RequestParam(required = false) String buscar,
            @RequestParam(required = false) String equipamiento
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


        List<CatalogoEjercicioResumenResponse> respuesta =
                catalogoEjercicioService
                        .obtenerTodos()
                        .stream()

                        .filter(ejercicio ->
                                coincide(
                                        ejercicio.getGrupoFitTrack(),
                                        grupo,
                                        false
                                )
                        )

                        .filter(ejercicio ->
                                coincide(
                                        ejercicio.getNombre(),
                                        buscar,
                                        true
                                )
                        )

                        .filter(ejercicio ->
                                coincide(
                                        ejercicio.getEquipamiento(),
                                        equipamiento,
                                        false
                                )
                        )

                        .sorted(
                                Comparator.comparing(
                                        CatalogoEjercicio::getNombre,
                                        String.CASE_INSENSITIVE_ORDER
                                )
                        )

                        .map(
                                CatalogoEjercicioResumenResponse::new
                        )

                        .toList();


        return ResponseEntity.ok(
                respuesta
        );
    }


    // OBTENER UN EJERCICIO DEL CATÁLOGO

    @GetMapping("/{ejercicioId}")
    public ResponseEntity<?> obtenerEjercicio(
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


        CatalogoEjercicio ejercicio =
                catalogoEjercicioService
                        .buscarPorId(
                                ejercicioId
                        )
                        .orElse(null);


        if (ejercicio == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }


        return ResponseEntity.ok(
                new CatalogoEjercicioDetalleResponse(
                        ejercicio
                )
        );
    }


    // COMPROBAR FILTROS

    private boolean coincide(
            String valor,
            String filtro,
            boolean parcial
    ) {

        if (
                filtro == null
                        || filtro.isBlank()
        ) {
            return true;
        }


        if (valor == null) {
            return false;
        }


        String valorNormalizado =
                valor.trim().toLowerCase();

        String filtroNormalizado =
                filtro.trim().toLowerCase();


        if (parcial) {
            return valorNormalizado.contains(
                    filtroNormalizado
            );
        }


        return valorNormalizado.equals(
                filtroNormalizado
        );
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


    // RESPUESTA PARA LISTADOS

    public static class CatalogoEjercicioResumenResponse {

        private Long id;
        private String sourceId;
        private String nombre;
        private String grupoFitTrack;
        private String equipamiento;
        private String musculoPrincipal;
        private String nivel;


        public CatalogoEjercicioResumenResponse() {
        }


        public CatalogoEjercicioResumenResponse(
                CatalogoEjercicio ejercicio
        ) {
            this.id =
                    ejercicio.getId();

            this.sourceId =
                    ejercicio.getSourceId();

            this.nombre =
                    ejercicio.getNombre();

            this.grupoFitTrack =
                    ejercicio.getGrupoFitTrack();

            this.equipamiento =
                    ejercicio.getEquipamiento();

            this.musculoPrincipal =
                    ejercicio.getMusculoPrincipal();

            this.nivel =
                    ejercicio.getNivel();
        }


        public Long getId() {
            return id;
        }


        public String getSourceId() {
            return sourceId;
        }


        public String getNombre() {
            return nombre;
        }


        public String getGrupoFitTrack() {
            return grupoFitTrack;
        }


        public String getEquipamiento() {
            return equipamiento;
        }


        public String getMusculoPrincipal() {
            return musculoPrincipal;
        }


        public String getNivel() {
            return nivel;
        }
    }


    // RESPUESTA COMPLETA DE UN EJERCICIO

    public static class CatalogoEjercicioDetalleResponse {

        private Long id;
        private String sourceId;
        private String nombreOriginal;
        private String nombre;

        private String grupoFitTrack;
        private String equipamiento;

        private String musculoPrincipal;

        private List<String> musculosPrincipales;
        private List<String> musculosSecundarios;

        private List<String> instrucciones;

        private String fuerza;
        private String nivel;
        private String mecanica;
        private String categoria;


        public CatalogoEjercicioDetalleResponse() {
        }


        public CatalogoEjercicioDetalleResponse(
                CatalogoEjercicio ejercicio
        ) {

            this.id =
                    ejercicio.getId();

            this.sourceId =
                    ejercicio.getSourceId();

            this.nombreOriginal =
                    ejercicio.getNombreOriginal();

            this.nombre =
                    ejercicio.getNombre();

            this.grupoFitTrack =
                    ejercicio.getGrupoFitTrack();

            this.equipamiento =
                    ejercicio.getEquipamiento();

            this.musculoPrincipal =
                    ejercicio.getMusculoPrincipal();

            this.musculosPrincipales =
                    ejercicio.getMusculosPrincipales();

            this.musculosSecundarios =
                    ejercicio.getMusculosSecundarios();

            this.instrucciones =
                    ejercicio.getInstrucciones();

            this.fuerza =
                    ejercicio.getFuerza();

            this.nivel =
                    ejercicio.getNivel();

            this.mecanica =
                    ejercicio.getMecanica();

            this.categoria =
                    ejercicio.getCategoria();
        }


        public Long getId() {
            return id;
        }


        public String getSourceId() {
            return sourceId;
        }


        public String getNombreOriginal() {
            return nombreOriginal;
        }


        public String getNombre() {
            return nombre;
        }


        public String getGrupoFitTrack() {
            return grupoFitTrack;
        }


        public String getEquipamiento() {
            return equipamiento;
        }


        public String getMusculoPrincipal() {
            return musculoPrincipal;
        }


        public List<String> getMusculosPrincipales() {
            return musculosPrincipales;
        }


        public List<String> getMusculosSecundarios() {
            return musculosSecundarios;
        }


        public List<String> getInstrucciones() {
            return instrucciones;
        }


        public String getFuerza() {
            return fuerza;
        }


        public String getNivel() {
            return nivel;
        }


        public String getMecanica() {
            return mecanica;
        }


        public String getCategoria() {
            return categoria;
        }
    }
}