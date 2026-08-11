package com.fittrack.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;


    public JwtAuthenticationFilter(
            JwtService jwtService
    ) {
        this.jwtService = jwtService;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");


        // SI NO HAY TOKEN, DEJAMOS QUE SPRING SECURITY CONTINÚE

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        String token =
                authorizationHeader.substring(7);


        try {

            // TOKEN INVÁLIDO O CADUCADO

            if (!jwtService.tokenValido(token)) {

                SecurityContextHolder.clearContext();

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.setContentType(
                        "application/json"
                );

                response.setCharacterEncoding(
                        "UTF-8"
                );

                response.getWriter().write(
                        "{\"error\":\"Token inválido o caducado\"}"
                );

                return;
            }


            // TOKEN VÁLIDO

            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {


                String email =
                        jwtService.obtenerEmail(token);


                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_USER"
                                        )
                                )
                        );


                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }


            filterChain.doFilter(
                    request,
                    response
            );


        } catch (Exception e) {

            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json"
            );

            response.setCharacterEncoding(
                    "UTF-8"
            );

            response.getWriter().write(
                    "{\"error\":\"Token inválido o caducado\"}"
            );
        }
    }
}