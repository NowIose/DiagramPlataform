package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilita un broker en memoria para los tópicos a los que el cliente se suscribirá
        config.enableSimpleBroker("/topic");
        // Prefijo para los mensajes enviados desde el cliente al servidor (ej. @MessageMapping)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint al que se conectará el cliente (SockJS/STOMP)
        registry.addEndpoint("/ws-diagram")
                .setAllowedOriginPatterns("*") // Permitir CORS
                .withSockJS(); // Soporte para navegadores que no soportan WebSockets puros
    }
}
