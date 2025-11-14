package com.joseneto.englishverse.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita CSRF (Padrão pra APIs REST modernas)
            .csrf(csrf -> csrf.disable())
            
            // Ativa a nossa configuração de CORS (definida lá embaixo)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Gerenciamento de Sessão (Stateless é o padrão pra API, mas por enquanto deixa default)
            // .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Configuração de Autorização (O Porteiro)
            .authorizeHttpRequests(auth -> auth
                // .requestMatchers("/**").permitAll() 
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Quem pode chamar a API? (Asterisco = Todo mundo)
        configuration.setAllowedOrigins(List.of("*")); // Em produção, tu bota "http://localhost:5173"
        
        // Quais métodos? (GET, POST, PUT, DELETE...)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Quais cabeçalhos?
        configuration.setAllowedHeaders(List.of("*"));
        
        // Permitir credenciais? (Cookies, Auth Headers) - Importante pro futuro
        // configuration.setAllowCredentials(true); // Se usar '*', isso aqui tem que ser false ou comentado

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
