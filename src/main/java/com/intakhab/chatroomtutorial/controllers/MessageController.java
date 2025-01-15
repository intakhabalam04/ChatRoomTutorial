package com.intakhab.chatroomtutorial.controllers;

import com.intakhab.chatroomtutorial.models.Message;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.messaging.handler.annotation.MessageMapping;

@RestController
public class MessageController {

    @MessageMapping("/message/{otp}")
    @SendTo("/topic/return-to/{otp}")
    public Message getContent(@RequestBody Message message) {
        return message;
    }

    @MessageMapping("/user-joined/{otp}")
    @SendTo("/topic/return-to/{otp}")
    public Message userJoined(@RequestBody Message message) {
        return message;
    }
}
