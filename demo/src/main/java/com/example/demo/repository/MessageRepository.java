package com.example.demo.repository;

import com.example.demo.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;




public interface MessageRepository extends MongoRepository<Message, String> {

  // Conversation between two users (both directions), ascending by time
  List<Message> findBySenderIdAndRecipientIdOrderBySentAtAsc(String senderId, String recipientId);

  // All messages received by a user
  List<Message> findByRecipientIdOrderBySentAtDesc(String recipientId);
}
