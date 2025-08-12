package com.example.demo.controller;

import com.example.demo.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWsController {

  private final SimpMessagingTemplate messaging;

  public ChatWsController(SimpMessagingTemplate messaging) {
    this.messaging = messaging;
  }

  // Broadcast room: client sends to /app/chat.send, everyone on /topic/messages gets it
  @MessageMapping("/chat.send")
  @SendTo("/topic/messages")
  public ChatMessage broadcast(ChatMessage msg) {
    if (msg.getTimestamp() == 0) msg.setTimestamp(System.currentTimeMillis());
    return msg;
  }

  // 1:1 direct: client sends to /app/chat.direct, server forwards to /user/{to}/queue/messages
  @MessageMapping("/chat.direct")
  public void direct(ChatMessage msg) {
    if (msg.getTimestamp() == 0) msg.setTimestamp(System.currentTimeMillis());
    // delivers to a single user subscription at /user/queue/messages
    messaging.convertAndSendToUser(msg.getTo(), "/queue/messages", msg);
  }
}
