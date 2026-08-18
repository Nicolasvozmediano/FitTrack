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

        if (
                usuario.getNombre() == null
                        || usuario.getNombre().isBlank()
        ) {

            return "El nombre es obligatorio";
        }


        if (
                usuario.getEmail() == null
                        || usuario.getEmail().isBlank()
        ) {

            return "El correo es obligatorio";
        }


        if (
                !usuario.getEmail().matches(
                        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
                )
        ) {

            return "El formato del correo no es válido";
        }


        if (
                usuario.getContrasena() == null
                        || usuario.getContrasena().isBlank()
        ) {

            return "La contraseña es obligatoria";
        }


        if (
                usuario.getContrasena().length() < 8
        ) {

            return "La contraseña debe tener al menos 8 caracteres";
        }


        if (
                buscarPorEmail(
                        usuario.getEmail()
                ).isPresent()
        ) {

            return "El correo ya está registrado";
        }


        return null;
    }


    public String validarLogin(Usuario usuario) {

        if (
                usuario.getEmail() == null
                        || usuario.getEmail().isBlank()
                        || usuario.getContrasena() == null
                        || usuario.getContrasena().isBlank()
        ) {

            return "Correo y contraseña son obligatorios";
        }


        if (
                !usuario.getEmail().matches(
                        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
                )
        ) {

            return "El formato del correo no es válido";
        }


        return null;
    }


    public Usuario guardarUsuario(Usuario usuario) {

        usuario.setContrasena(
                passwordEncoder.encode(
                        usuario.getContrasena()
                )
        );


        return usuarioRepository.save(
                usuario
        );
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


    public Usuario buscarUsuarioPorEmail(
            String email
    ) {

        return usuarioRepository
                .findByEmail(email)
                .orElse(null);
    }


    /*
     * ACTUALIZAR PERFIL DEPORTIVO
     */

    public Usuario actualizarPerfilDeportivo(
            String email,
            Double peso,
            Integer alturaCm,
            String objetivo,
            String nivelExperiencia
    ) {

        Usuario usuario =
                buscarUsuarioPorEmail(email);


        if (usuario == null) {

            return null;
        }


        usuario.setPeso(peso);
        usuario.setAlturaCm(alturaCm);
        usuario.setObjetivo(
                limpiarTexto(objetivo)
        );
        usuario.setNivelExperiencia(
                limpiarTexto(
                        nivelExperiencia
                )
        );


        /*
         * Importante:
         *
         * Aquí usamos directamente usuarioRepository.save().
         *
         * NO usamos guardarUsuario(), porque ese método
         * volvería a cifrar la contraseña existente.
         */

        return usuarioRepository.save(
                usuario
        );
    }


    /*
     * VALIDAR PERFIL DEPORTIVO
     */

    public String validarPerfilDeportivo(
            Double peso,
            Integer alturaCm,
            String objetivo,
            String nivelExperiencia
    ) {

        if (
                peso != null
                        && (
                        peso <= 0
                                || peso > 500
                )
        ) {

            return "El peso indicado no es válido";
        }


        if (
                alturaCm != null
                        && (
                        alturaCm <= 0
                                || alturaCm > 300
                )
        ) {

            return "La altura indicada no es válida";
        }


        if (
                objetivo != null
                        && objetivo.length() > 100
        ) {

            return "El objetivo es demasiado largo";
        }


        if (
                nivelExperiencia != null
                        && nivelExperiencia.length() > 50
        ) {

            return "El nivel de experiencia es demasiado largo";
        }


        return null;
    }


    /*
     * LIMPIAR TEXTOS OPCIONALES
     */

    private String limpiarTexto(
            String texto
    ) {

        if (texto == null) {

            return null;
        }


        String limpio =
                texto.trim();


        if (limpio.isEmpty()) {

            return null;
        }


        return limpio;
    }
}