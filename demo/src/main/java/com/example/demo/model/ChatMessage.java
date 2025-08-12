package com.example.demo.model;

public class ChatMessage {
  private String from;
  private String to;     // optional for 1:1
  private String text;
  private long   timestamp;

  public String getFrom() { return from; }
  public void setFrom(String from) { this.from = from; }
  public String getTo() { return to; }
  public void setTo(String to) { this.to = to; }
  public String getText() { return text; }
  public void setText(String text) { this.text = text; }
  public long getTimestamp() { return timestamp; }
  public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
