package com.example.chat_app.repository;
// import com.example.chat_app.model.SignupRequest;
import  com.example.chat_app.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


// src/main/java/com/example/chat_app/repository/UserRepository.java
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUserEmailAndUserPassword(String userEmail, String userPassword);
    User findByUserEmail(String userEmail);
}
