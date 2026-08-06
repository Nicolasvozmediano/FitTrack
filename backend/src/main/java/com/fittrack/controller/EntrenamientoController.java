package com.fittrack.controller;

import com.fittrack.model.Entrenamiento;
import com.fittrack.model.Usuario;
import com.fittrack.repository.EntrenamientoRepository;
import com.fittrack.repository.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/entrenamientos")
@CrossOrigin(origins = "http://localhost:5173")
public class EntrenamientoController {


private final EntrenamientoRepository entrenamientoRepository;
private final UsuarioRepository usuarioRepository;

public EntrenamientoController(
        EntrenamientoRepository entrenamientoRepository,
        UsuarioRepository usuarioRepository
) {
    this.entrenamientoRepository = entrenamientoRepository;
    this.usuarioRepository = usuarioRepository;
}

@GetMapping("/usuario/{usuarioId}")
public ResponseEntity<List<Entrenamiento>> obtenerEntrenamientos(
        @PathVariable Long usuarioId
) {
    List<Entrenamiento> entrenamientos =
            entrenamientoRepository.findByUsuarioId(usuarioId);

    return ResponseEntity.ok(entrenamientos);
}

@PostMapping
public ResponseEntity<?> crearEntrenamiento(
        @RequestBody Entrenamiento entrenamiento
) {

    if (entrenamiento.getUsuario() == null ||
            entrenamiento.getUsuario().getId() == null) {

        return ResponseEntity.badRequest()
                .body("El usuario es obligatorio");
    }

    Long usuarioId = entrenamiento.getUsuario().getId();

    Optional<Usuario> usuario =
            usuarioRepository.findById(usuarioId);

    if (usuario.isEmpty()) {
        return ResponseEntity.badRequest()
                .body("El usuario no existe");
    }

    entrenamiento.setUsuario(usuario.get());

    Entrenamiento nuevoEntrenamiento =
            entrenamientoRepository.save(entrenamiento);

    return ResponseEntity.ok(nuevoEntrenamiento);
}

@DeleteMapping("/{id}")
public ResponseEntity<?> eliminarEntrenamiento(
        @PathVariable Long id
) {

    if (!entrenamientoRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    entrenamientoRepository.deleteById(id);

    return ResponseEntity.ok(
            "Entrenamiento eliminado correctamente"
    );
}


}
