package com.fittrack.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String CLAVE_SECRETA =
            "FitTrackClaveJwtMuySeguraConMasDe32Caracteres2026";

    private static final long DURACION_TOKEN =
            24 * 60 * 60 * 1000;

    private SecretKey obtenerClave() {
        return Keys.hmacShaKeyFor(
                CLAVE_SECRETA.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generarToken(
            Long usuarioId,
            String email
    ) {
        Date ahora = new Date();
        Date expiracion = new Date(
                ahora.getTime() + DURACION_TOKEN
        );

        return Jwts.builder()
                .subject(email)
                .claim("usuarioId", usuarioId)
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(obtenerClave())
                .compact();
    }

    private Claims obtenerClaims(String token) {
        return Jwts.parser()
                .verifyWith(obtenerClave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String obtenerEmail(String token) {
        return obtenerClaims(token).getSubject();
    }

    public Long obtenerUsuarioId(String token) {
        Number usuarioId = obtenerClaims(token)
                .get("usuarioId", Number.class);

        return usuarioId.longValue();
    }

    public boolean tokenValido(String token) {
        try {
            Date expiracion = obtenerClaims(token).getExpiration();
            return expiracion.after(new Date());
        } catch (Exception exception) {
            return false;
        }
    }
}