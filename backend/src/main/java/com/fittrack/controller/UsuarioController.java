package com.fittrack.controller;

import com.fittrack.LoginResponse;
import com.fittrack.model.Usuario;
import com.fittrack.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/usuarios")
public class UsuarioController {


private final UsuarioRepository usuarioRepository;
private final PasswordEncoder passwordEncoder;

public UsuarioController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
}

@GetMapping
public List<Usuario> obtenerUsuarios() {
    return usuarioRepository.findAll();
}

@PostMapping
public Usuario crearUsuario(@RequestBody Usuario usuario) {
    usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
    return usuarioRepository.save(usuario);
}

@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@RequestBody Usuario usuario) {

    Optional<Usuario> usuarioEncontrado =
            usuarioRepository.findByEmail(usuario.getEmail());

    if (usuarioEncontrado.isPresent()) {

        Usuario usuarioBD = usuarioEncontrado.get();

        if (passwordEncoder.matches(
                usuario.getContrasena(),
                usuarioBD.getContrasena())) {

            LoginResponse respuesta = new LoginResponse(
                    usuarioBD.getId(),
                    usuarioBD.getNombre(),
                    usuarioBD.getEmail()
            );

            return ResponseEntity.ok(respuesta);
        }
    }

    return ResponseEntity.status(401).build();
}


}
