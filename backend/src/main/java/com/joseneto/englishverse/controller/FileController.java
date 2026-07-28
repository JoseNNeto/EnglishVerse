package com.joseneto.englishverse.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.joseneto.englishverse.service.FileStorageService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private static final long OITO_MB = 8L * 1024 * 1024;
    private static final long DEZ_MB = 10L * 1024 * 1024;
    private static final long CEM_MB = 100L * 1024 * 1024;

    @Autowired
    private FileStorageService fileStorageService;

    // O aluno manda o arquivo aqui
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        validarArquivo(file, DEZ_MB, "O arquivo deve ter no máximo 10 MB.");
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

    @PostMapping("/content/upload")
    public ResponseEntity<Map<String, String>> uploadContent(
            @RequestParam("file") MultipartFile file) {
        validarArquivo(file, CEM_MB, "A mídia deve ter no máximo 100 MB.");
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.startsWith("image/")
                || contentType.startsWith("audio/")
                || contentType.startsWith("video/")
                || contentType.equals("application/pdf"))) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Envie uma imagem, um áudio, um vídeo ou um PDF.");
        }

        String nomeArquivo = fileStorageService.salvarConteudo(file);
        return ResponseEntity.ok(Map.of(
            "fileName", nomeArquivo,
            "originalFileName", file.getOriginalFilename() == null
                ? nomeArquivo : file.getOriginalFilename(),
            "fileDownloadUri", "/api/files/content/" + nomeArquivo,
            "size", String.valueOf(file.getSize())
        ));
    }

    // O sistema usa isso pra tocar o áudio ou mostrar a imagem
    @PostMapping("/covers/upload")
    public ResponseEntity<Map<String, String>> uploadCover(
            @RequestParam("file") MultipartFile file) {
        validarArquivo(file, OITO_MB, "A imagem deve ter no máximo 8 MB.");
        if (file.isEmpty() || file.getContentType() == null
                || !file.getContentType().startsWith("image/")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Selecione uma imagem válida para a capa.");
        }
        String nomeArquivo = fileStorageService.salvarCapa(file);
        return ResponseEntity.ok(Map.of(
            "fileName", nomeArquivo,
            "fileDownloadUri", "/api/files/covers/" + nomeArquivo,
            "size", String.valueOf(file.getSize())
        ));
    }

    @GetMapping("/content/{fileName:.+}")
    public ResponseEntity<Resource> downloadContent(
            @PathVariable String fileName, HttpServletRequest request) {
        try {
            return responderArquivo(fileStorageService.carregarConteudo(fileName), request);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Mídia da atividade não encontrada.", exception);
        }
    }

    @GetMapping("/covers/{fileName:.+}")
    public ResponseEntity<Resource> downloadCover(
            @PathVariable String fileName, HttpServletRequest request) {
        try {
            return responderArquivo(fileStorageService.carregarCapa(fileName), request);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Imagem de capa não encontrada.", exception);
        }
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.carregarArquivo(fileName);
        return responderArquivo(resource, request);
    }

    private void validarArquivo(MultipartFile file, long tamanhoMaximo, String mensagemTamanho) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione um arquivo válido.");
        }
        if (file.getSize() > tamanhoMaximo) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, mensagemTamanho);
        }
    }

    private ResponseEntity<Resource> responderArquivo(
            Resource resource, HttpServletRequest request) {
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
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    ContentDisposition.inline()
                        .filename(resource.getFilename(), StandardCharsets.UTF_8)
                        .build()
                        .toString())
                .body(resource);
    }
}
