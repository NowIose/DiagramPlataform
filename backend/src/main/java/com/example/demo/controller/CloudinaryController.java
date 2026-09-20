package com.example.demo.controller;

import com.example.demo.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    public CloudinaryController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error uploading image: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{publicId}")
    public ResponseEntity<String> deleteImage(@PathVariable String publicId) {
        try {
            Map result = cloudinaryService.deleteImage(publicId);
            return ResponseEntity.ok(result.toString());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error deleting image: " + e.getMessage());
        }
    }
}
