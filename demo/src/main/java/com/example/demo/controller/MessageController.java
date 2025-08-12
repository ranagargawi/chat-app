package com.example.demo.controller;

import com.example.demo.dto.SendMessageRequest;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;





@RestController
@RequestMapping("/messages")
public class MessageController {

  private final MessageRepository messages;
  private final UserRepository users;

  public MessageController(MessageRepository messages, UserRepository users) {
    this.messages = messages;
    this.users = users;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Message send(@Valid @RequestBody SendMessageRequest req) {
    // basic sanity: users must exist
    User sender = users.findById(req.senderId)
        .orElseThrow(() -> new IllegalArgumentException("senderId not found"));
    User recipient = users.findById(req.recipientId)
        .orElseThrow(() -> new IllegalArgumentException("recipientId not found"));

    return messages.save(new Message(sender.getId(), recipient.getId(), req.content));
  }

  // Conversation between two users (both directions, merged & sorted)
  @GetMapping("/conversation")
  public List<Message> conversation(@RequestParam String userAId, @RequestParam String userBId) {
    List<Message> ab = messages.findBySenderIdAndRecipientIdOrderBySentAtAsc(userAId, userBId);
    List<Message> ba = messages.findBySenderIdAndRecipientIdOrderBySentAtAsc(userBId, userAId);

    List<Message> merged = new ArrayList<>(ab.size() + ba.size());
    merged.addAll(ab);
    merged.addAll(ba);
    merged.sort(Comparator.comparing(Message::getSentAt));
    return merged;
  }

  // Inbox for a user (messages they received)
  @GetMapping("/inbox/{userId}")
  public List<Message> inbox(@PathVariable String userId) {
    return messages.findByRecipientIdOrderBySentAtDesc(userId);
  }
}
