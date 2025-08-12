package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Document(collection = "messages")
public class Message {

  @Id
  private String id;

  @NotNull
  private String senderId;

  @NotNull
  private String recipientId;

  @NotBlank
  private String content;

  private Instant sentAt = Instant.now();

  public Message() {}

  public Message(String senderId, String recipientId, String content) {
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.content = content;
    this.sentAt = Instant.now();
  }

  public String getId() { return id; }
  public String getSenderId() { return senderId; }
  public String getRecipientId() { return recipientId; }
  public String getContent() { return content; }
  public Instant getSentAt() { return sentAt; }

  public void setId(String id) { this.id = id; }
  public void setSenderId(String senderId) { this.senderId = senderId; }
  public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
  public void setContent(String content) { this.content = content; }
  public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }
}
