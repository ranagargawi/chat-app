package com.example.demo.repository;

import com.example.demo.model.User;

// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;



public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findByEmail(String email);
  Optional<User> findByUsername(String username);
  boolean existsByEmail(String email);
  boolean existsByUsername(String username);
}
