package com.example.chat_app.controller;
import com.example.chat_app.model.SignupRequest;
import com.example.chat_app.model.User;
import com.example.chat_app.repository.UserRepository;
import com.example.chat_app.service.UserService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;
  @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody SignupRequest req) {
        return ResponseEntity.ok(userService.signUp(req));
    }

    @PostMapping("/login/{userEmail}/{userPassword}")
    public ResponseEntity<Boolean> signIn(@PathVariable String userEmail, @PathVariable String userPassword) {
        //TODO: process POST request
                return ResponseEntity.ok(userService.login(userEmail, userPassword));

    }

     // Endpoint to fetch all employees
    @PostMapping("/all")
    //@PreAuthorize("hasRole('USER')")  // Optional: Protect the endpoint with role-based security
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
