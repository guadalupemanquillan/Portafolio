package com.porftolio.guadalupe.controllers;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class StaticFileController {

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path uploadDir = Paths.get("uploads");
            Path filePath = uploadDir.resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determine content type based on file extension
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000") // Cache for 1 year
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String determineContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        switch (extension) {
            case "svg":
                return "image/svg+xml";
            case "png":
                return "image/png";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream";
        }
    }

    @GetMapping("/uploads/debug/list")
    public ResponseEntity<Map<String, Object>> listUploads() {
        Map<String, Object> response = new HashMap<>();
        try {
            Path uploadDir = Paths.get("uploads");
            response.put("uploadDirExists", Files.exists(uploadDir));
            response.put("uploadDirPath", uploadDir.toAbsolutePath().toString());
            response.put("workingDirectory", System.getProperty("user.dir"));
            
            if (Files.exists(uploadDir)) {
                List<String> files = Files.list(uploadDir)
                    .map(path -> path.getFileName().toString())
                    .collect(Collectors.toList());
                response.put("files", files);
                response.put("fileCount", files.size());
            } else {
                response.put("files", Arrays.asList());
                response.put("fileCount", 0);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
