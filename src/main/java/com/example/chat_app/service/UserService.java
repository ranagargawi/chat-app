package com.example.chat_app.service;
import com.example.chat_app.model.SignupRequest;
import com.example.chat_app.model.User;
import com.example.chat_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User signUp(SignupRequest request) {
        User user = new User();
        user.setUserName(request.getName());
        user.setUserEmail(request.getEmail());
        user.setUserPassword(request.getPassword());
        return userRepository.save(user);
    }

    public boolean login(String userEmail, String userPassword) {

        boolean flag = false;

        User user = userRepository.findByUserEmailAndUserPassword(userEmail, userPassword);
if (user != null && user.getUserEmail().equals(userEmail) && user.getUserPassword().equals(userPassword)) {
    flag = true;
}
        return flag;
    }

}
