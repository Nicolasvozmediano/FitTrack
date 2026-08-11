package com.fittrack.service;

import com.fittrack.model.Usuario;
import com.fittrack.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }


    public String validarRegistro(Usuario usuario) {

        if (usuario.getNombre() == null
                || usuario.getNombre().isBlank()) {
            return "El nombre es obligatorio";
        }

        if (usuario.getEmail() == null
                || usuario.getEmail().isBlank()) {
            return "El correo es obligatorio";
        }

        if (!usuario.getEmail().matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
        )) {
            return "El formato del correo no es válido";
        }

        if (usuario.getContrasena() == null
                || usuario.getContrasena().isBlank()) {
            return "La contraseña es obligatoria";
        }

        if (usuario.getContrasena().length() < 8) {
            return "La contraseña debe tener al menos 8 caracteres";
        }

        if (buscarPorEmail(usuario.getEmail()).isPresent()) {
            return "El correo ya está registrado";
        }

        return null;
    }


    public String validarLogin(Usuario usuario) {

        if (usuario.getEmail() == null
                || usuario.getEmail().isBlank()
                || usuario.getContrasena() == null
                || usuario.getContrasena().isBlank()) {

            return "Correo y contraseña son obligatorios";
        }

        if (!usuario.getEmail().matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
        )) {
            return "El formato del correo no es válido";
        }

        return null;
    }


    public Usuario guardarUsuario(Usuario usuario) {

        usuario.setContrasena(
                passwordEncoder.encode(usuario.getContrasena())
        );

        return usuarioRepository.save(usuario);
    }


    public boolean contrasenaCorrecta(
            String contrasena,
            String contrasenaCifrada
    ) {

        return passwordEncoder.matches(
                contrasena,
                contrasenaCifrada
        );
    }


    public Usuario buscarUsuarioPorEmail(String email) {

        return usuarioRepository.findByEmail(email)
                .orElse(null);
    }
}