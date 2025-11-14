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

    public FileStorageService() {
        try {
            // Cria a pasta 'uploads' quando o sistema sobe
            Files.createDirectories(this.localArmazenamento);
        } catch (Exception ex) {
            throw new RuntimeException("Eita, não consegui criar a pasta de uploads!", ex);
        }
    }

    public String salvarArquivo(MultipartFile file) {
        // Normaliza o nome original
        String nomeOriginal = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Gera um nome único pra não dar conflito (ex: uuid_nomedoarquivo.png)
            String nomeArquivo = UUID.randomUUID().toString() + "_" + nomeOriginal;

            // O caminho completo
            Path destino = this.localArmazenamento.resolve(nomeArquivo);

            // Copia o arquivo (se existir um igual, substitui)
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // Retorna só o nome do arquivo pra gente salvar no banco
            return nomeArquivo;
        } catch (IOException ex) {
            throw new RuntimeException("Deu bronca ao salvar o arquivo " + nomeOriginal, ex);
        }
    }

    public Resource carregarArquivo(String filename) {
        try {
            Path caminhoArquivo = this.localArmazenamento.resolve(filename).normalize();
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
