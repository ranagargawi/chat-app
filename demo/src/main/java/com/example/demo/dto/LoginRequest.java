package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
  @NotBlank
  public String username;

  @NotBlank
  @Email
  public String email;

  @NotBlank
  public String password; // Optional, if you want to store passwords
}
