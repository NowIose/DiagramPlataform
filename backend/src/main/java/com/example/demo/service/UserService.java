package com.example.demo.service;

import com.example.demo.model.user.User;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.user.AuthProvider;
import com.example.demo.model.user.Role;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new RuntimeException("El nombre de usuario es obligatorio");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("El correo electrónico es obligatorio");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }

        String email = request.getEmail().trim().toLowerCase();
        String username = request.getUsername().trim();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("El nombre de usuario ya está registrado");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt
        
        // Si se provee avatarUrl personalizada, se asigna; de lo contrario se genera un avatar por defecto
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().trim().isEmpty()) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        } else {
            user.setAvatarUrl("https://ui-avatars.com/api/?name=" + username + "&background=094cb2&color=fff");
        }

        if (request.getGoogleId() != null && !request.getGoogleId().trim().isEmpty()) {
            user.setGoogleId(request.getGoogleId().trim());
        }

        user.setAuthProvider(request.getAuthProvider() != null ? request.getAuthProvider() : AuthProvider.LOCAL);
        user.setRole(Role.ROLE_USER);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getEmail());
        return new AuthResponse(token, savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Debe ingresar su correo o nombre de usuario");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Debe ingresar su contraseña");
        }

        String identifier = request.getEmail().trim();

        // Permite iniciar sesión con correo o con nombre de usuario
        User user = userRepository.findByEmailOrUsername(identifier.toLowerCase(), identifier)
                .orElseThrow(() -> new RuntimeException("Usuario o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("La cuenta de usuario está deshabilitada");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user);
    }
}