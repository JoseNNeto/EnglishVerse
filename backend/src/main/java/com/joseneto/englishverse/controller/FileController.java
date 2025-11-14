package com.joseneto.englishverse.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.joseneto.englishverse.service.FileStorageService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Autowired
    private FileStorageService fileStorageService;

    // O aluno manda o arquivo aqui
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String nomeArquivo = fileStorageService.salvarArquivo(file);

        // A gente devolve a URL completa pra facilitar pro Front
        // Ex: http://localhost:8080/api/files/uuid_audio.mp3
        String fileDownloadUri = "/api/files/" + nomeArquivo;

        return ResponseEntity.ok(Map.of(
            "fileName", nomeArquivo,
            "fileDownloadUri", fileDownloadUri,
            "size", String.valueOf(file.getSize())
        ));
    }

    // O sistema usa isso pra tocar o áudio ou mostrar a imagem
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.carregarArquivo(fileName);

        // Tenta descobrir o tipo do arquivo (imagem, áudio, pdf)
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Se não descobrir, segue o baile
        }

        if(contentType == null) {
            contentType = "application/octet-stream"; // Tipo genérico
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
