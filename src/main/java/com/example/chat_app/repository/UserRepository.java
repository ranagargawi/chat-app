package com.example.chat_app.repository;
// import com.example.chat_app.model.SignupRequest;
import  com.example.chat_app.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends MongoRepository<User, Integer> {
    User findByEmailAndPassword(String email, String password);
    User findByEmail(String email);
}