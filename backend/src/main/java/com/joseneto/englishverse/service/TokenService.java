package com.joseneto.englishverse.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenService {

    // TODO: Mover para application.properties
    @Value("${api.security.token.secret}")
    private String secret;
    private SecretKey secretKey;

    public String generateToken(Usuario usuario) {
        secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        try {
            return Jwts.builder()
                    .setIssuer("englishverse-api")
                    .claim("nome", usuario.getNome()) // Adiciona o nome do usuário ao token
                    .setSubject(usuario.getEmail())
                    .setIssuedAt(Date.from(Instant.now()))
                    .setExpiration(Date.from(genExpirationDate()))
                    .signWith(secretKey, SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar token", e);
        }
    }

    public String validateToken(String token) {
        secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return ""; // Token inválido
        }
    }

    private Instant genExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
