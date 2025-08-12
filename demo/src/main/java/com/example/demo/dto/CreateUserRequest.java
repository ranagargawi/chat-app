package com.example.demo.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CreateUserRequest {
  @NotBlank
  public String username;

  @NotBlank
  @Email
  public String email;
}
