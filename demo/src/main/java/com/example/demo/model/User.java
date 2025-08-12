package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "users")
public class User {

  @Id
  private String id;

  @NotBlank
  @Indexed(unique = true)
  private String username;

  @NotBlank
  @Email
  @Indexed(unique = true)
  private String email;

  public User() {}

  public User(String username, String email) {
    this.username = username;
    this.email = email;
  }

  public String getId() { return id; }
  public String getUsername() { return username; }
  public String getEmail() { return email; }

  public void setId(String id) { this.id = id; }
  public void setUsername(String username) { this.username = username; }
  public void setEmail(String email) { this.email = email; }
}
