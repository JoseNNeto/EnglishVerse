package com.joseneto.englishverse.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    private final Path localArmazenamento = Paths.get("uploads").toAbsolutePath().normalize();
    private final Path capasArmazenamento = localArmazenamento.resolve("covers").normalize();
    private final Path conteudosArmazenamento = localArmazenamento.resolve("content").normalize();

    public FileStorageService() {
        try {
            // Cria a pasta 'uploads' quando o sistema sobe
            Files.createDirectories(this.localArmazenamento);
            Files.createDirectories(this.capasArmazenamento);
            Files.createDirectories(this.conteudosArmazenamento);
        } catch (Exception ex) {
            throw new RuntimeException("Eita, não consegui criar a pasta de uploads!", ex);
        }
    }

    public String salvarArquivo(MultipartFile file) {
        return salvarArquivo(file, localArmazenamento);
    }

    public String salvarCapa(MultipartFile file) {
        return salvarArquivo(file, capasArmazenamento);
    }

    public String salvarConteudo(MultipartFile file) {
        return salvarArquivo(file, conteudosArmazenamento);
    }

    private String salvarArquivo(MultipartFile file, Path diretorio) {
        // Normaliza o nome original
        String nomeOriginal = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Gera um nome único pra não dar conflito (ex: uuid_nomedoarquivo.png)
            String nomeArquivo = UUID.randomUUID().toString() + "_" + nomeOriginal;

            // O caminho completo
            Path destino = diretorio.resolve(nomeArquivo).normalize();
            if (!destino.startsWith(diretorio)) {
                throw new RuntimeException("Nome de arquivo inválido.");
            }

            // Copia o arquivo (se existir um igual, substitui)
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // Retorna só o nome do arquivo pra gente salvar no banco
            return nomeArquivo;
        } catch (IOException ex) {
            throw new RuntimeException("Deu bronca ao salvar o arquivo " + nomeOriginal, ex);
        }
    }

    public Resource carregarArquivo(String filename) {
        return carregarArquivo(filename, localArmazenamento);
    }

    public Resource carregarCapa(String filename) {
        return carregarArquivo(filename, capasArmazenamento);
    }

    public Resource carregarConteudo(String filename) {
        return carregarArquivo(filename, conteudosArmazenamento);
    }

    private Resource carregarArquivo(String filename, Path diretorio) {
        try {
            Path caminhoArquivo = diretorio.resolve(filename).normalize();
            if (!caminhoArquivo.startsWith(diretorio)) {
                throw new RuntimeException("Arquivo não encontrado: " + filename);
            }
            Resource recurso = new UrlResource(caminhoArquivo.toUri());

            if (recurso.exists()) {
                return recurso;
            } else {
                throw new RuntimeException("Arquivo não encontrado: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Arquivo não encontrado: " + filename, ex);
        }
    }
}
