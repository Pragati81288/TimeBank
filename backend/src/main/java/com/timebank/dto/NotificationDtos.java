package com.timebank.dto;

import java.time.LocalDateTime;

public final class NotificationDtos {

    private NotificationDtos() {
    }

    public record NotificationDto(Long id, String message, boolean read, LocalDateTime createdAt) {
    }
}
