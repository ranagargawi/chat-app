package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SendMessageRequest {
  @NotNull
  public String senderId;
  @NotNull
  public String recipientId;
  @NotBlank
  public String content;
}
