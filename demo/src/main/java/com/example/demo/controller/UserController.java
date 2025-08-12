package com.example.demo.controller;

import com.example.demo.dto.CreateUserRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
// import com.example.demo.dto.LoginRequest;
// import java.util.Map;
import java.util.List;





@RestController
@RequestMapping("/users")
public class UserController {

  private final UserRepository users;

  public UserController(UserRepository users) {
    this.users = users;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public User create(@Valid @RequestBody CreateUserRequest req) {
    if (users.existsByEmail(req.email)) {
      throw new DuplicateKeyException("Email already exists");
    }
    if (users.existsByUsername(req.username)) {
      throw new DuplicateKeyException("Username already exists");
    }
    return users.save(new User(req.username, req.email));
  }

  @GetMapping
  public List<User> list() {
    return users.findAll();
  }
}
