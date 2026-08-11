package com.fittrack.config;

import com.fittrack.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // DESACTIVAR CSRF

                .csrf(csrf ->
                        csrf.disable()
                )


                // API SIN SESIONES

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // RUTAS PÚBLICAS Y PROTEGIDAS

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/usuarios",
                                "/api/usuarios/login"
                        )
                        .permitAll()

                        .anyRequest()
                        .authenticated()
                )


                // MANEJO DE ERRORES DE SEGURIDAD

                .exceptionHandling(exception -> exception

                        // NO AUTENTICADO → 401

                        .authenticationEntryPoint(
                                (request, response, authException) -> {

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
                                            "{\"error\":\"Debes iniciar sesión\"}"
                                    );
                                }
                        )


                        // AUTENTICADO PERO SIN PERMISO → 403

                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {

                                    response.setStatus(
                                            HttpServletResponse.SC_FORBIDDEN
                                    );

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.setCharacterEncoding(
                                            "UTF-8"
                                    );

                                    response.getWriter().write(
                                            "{\"error\":\"No tienes permiso para acceder a este recurso\"}"
                                    );
                                }
                        )
                )


                // DESACTIVAR HTTP BASIC

                .httpBasic(httpBasic ->
                        httpBasic.disable()
                )


                // DESACTIVAR LOGIN POR FORMULARIO

                .formLogin(formLogin ->
                        formLogin.disable()
                )


                // FILTRO JWT

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}