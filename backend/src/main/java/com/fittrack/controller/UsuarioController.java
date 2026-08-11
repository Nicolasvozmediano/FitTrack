package com.fittrack.controller;

import com.fittrack.dto.AuthResponse;
import com.fittrack.dto.ErrorResponse;
import com.fittrack.dto.LoginRequest;
import com.fittrack.dto.LoginResponse;
import com.fittrack.dto.RegistroRequest;
import com.fittrack.dto.UsuarioResponse;
import com.fittrack.model.Usuario;
import com.fittrack.security.JwtService;
import com.fittrack.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(
            UsuarioService usuarioService,
            JwtService jwtService
    ) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }


    @PostMapping
    public ResponseEntity<?> crearUsuario(
            @RequestBody RegistroRequest registroRequest
    ) {

        Usuario usuario = new Usuario();

        usuario.setNombre(registroRequest.getNombre());
        usuario.setEmail(registroRequest.getEmail());
        usuario.setContrasena(registroRequest.getContrasena());
        usuario.setFechaRegistro(registroRequest.getFechaRegistro());

        String error = usuarioService.validarRegistro(usuario);

        if (error != null) {

            ErrorResponse respuestaError =
                    new ErrorResponse(error);

            if (error.equals("El correo ya está registrado")) {
                return ResponseEntity
                        .status(409)
                        .body(respuestaError);
            }

            return ResponseEntity
                    .badRequest()
                    .body(respuestaError);
        }


        Usuario usuarioGuardado =
                usuarioService.guardarUsuario(usuario);


        UsuarioResponse respuesta =
                new UsuarioResponse(
                        usuarioGuardado.getId(),
                        usuarioGuardado.getNombre(),
                        usuarioGuardado.getEmail(),
                        usuarioGuardado.getFechaRegistro()
                );


        return ResponseEntity.ok(respuesta);
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest
    ) {

        Usuario usuario = new Usuario();

        usuario.setEmail(loginRequest.getEmail());
        usuario.setContrasena(loginRequest.getContrasena());


        String error = usuarioService.validarLogin(usuario);

        if (error != null) {

            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse(error));
        }


        Optional<Usuario> usuarioEncontrado =
                usuarioService.buscarPorEmail(
                        loginRequest.getEmail()
                );


        if (usuarioEncontrado.isPresent()) {

            Usuario usuarioBD =
                    usuarioEncontrado.get();


            boolean contrasenaValida =
                    usuarioService.contrasenaCorrecta(
                            loginRequest.getContrasena(),
                            usuarioBD.getContrasena()
                    );


            if (contrasenaValida) {

                String token =
                        jwtService.generarToken(
                                usuarioBD.getId(),
                                usuarioBD.getEmail()
                        );


                AuthResponse respuesta =
                        new AuthResponse(
                                usuarioBD.getId(),
                                usuarioBD.getNombre(),
                                usuarioBD.getEmail(),
                                token
                        );


                return ResponseEntity.ok(respuesta);
            }
        }


        return ResponseEntity
                .status(401)
                .body(
                        new ErrorResponse(
                                "Correo o contraseña incorrectos"
                        )
                );
    }




    @GetMapping("/perfil")
    public ResponseEntity<?> perfil(
            @RequestHeader("Authorization") String authorization
    ) {


        String token =
                authorization.substring(7);


        String email =
                jwtService.obtenerEmail(token);


        Usuario usuario =
                usuarioService.buscarUsuarioPorEmail(email);


        if (usuario == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        UsuarioResponse respuesta =
                new UsuarioResponse(
                        usuario.getId(),
                        usuario.getNombre(),
                        usuario.getEmail(),
                        usuario.getFechaRegistro()
                );


        return ResponseEntity.ok(respuesta);
    }

}