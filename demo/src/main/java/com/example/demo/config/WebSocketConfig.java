package com.example.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    // Client connects to ws://localhost:8080/ws (or http -> SockJS)
    registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS(); // remove .withSockJS() if you want pure WebSocket only
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    // Clients subscribe to /topic/* (broadcast) or /user/queue/* (1:1)
    registry.enableSimpleBroker("/topic", "/queue");
    // Messages sent to /app/* will route to @MessageMapping methods
    registry.setApplicationDestinationPrefixes("/app");
    // For user-specific queues like /user/queue/messages
    registry.setUserDestinationPrefix("/user");
  }
}
