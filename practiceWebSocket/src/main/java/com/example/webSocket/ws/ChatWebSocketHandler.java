package com.example.demo.webSocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.Instant;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

  private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
  private final ObjectMapper mapper = new ObjectMapper();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    sessions.add(session);
  }

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    // Expect JSON: { "type": "CHAT"|"JOIN"|"LEAVE", "sender": "name", "content": "text" }
    JsonNode node = mapper.readTree(message.getPayload());
    String type = node.path("type").asText("CHAT");
    String sender = node.path("sender").asText("Anonymous");
    String content = node.path("content").asText("");

    // Build broadcast message (server stamps time)
    var payload = mapper.createObjectNode();
    payload.put("type", type);
    payload.put("sender", sender);
    payload.put("content", content);
    payload.put("timestamp", Instant.now().toString());

    broadcast(payload.toString());
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    sessions.remove(session);
  }

  @Override
  public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
    session.close(CloseStatus.SERVER_ERROR);
    sessions.remove(session);
  }

  private void broadcast(String json) {
    TextMessage out = new TextMessage(json);
    sessions.forEach(s -> {
      try {
        if (s.isOpen()) s.sendMessage(out);
      } catch (Exception ignored) {}
    });
  }
}
