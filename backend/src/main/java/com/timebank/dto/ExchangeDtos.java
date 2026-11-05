package com.timebank.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public final class ExchangeDtos {

    private ExchangeDtos() {
    }

    public record Participant(Long id, String fullName, String avatarId) {
    }

    public record ExchangeRequestDto(
            Long id,
            Participant learner,
            Participant teacher,
            String skillName,
            int hours,
            String message,
            String status,
            String role,
            LocalDateTime createdAt,
            Long sessionId,
            LocalDateTime scheduledAt,
            String sessionStatus,
            boolean rateable
    ) {
    }

    public record SessionDto(
            Long id,
            Long requestId,
            String skillName,
            String partnerName,
            String partnerAvatarId,
            String role,
            LocalDateTime scheduledAt,
            int hours,
            String status,
            boolean rateable
    ) {
    }

    public record RatingDto(
            Long id,
            String raterName,
            int stars,
            String comment,
            String skillName,
            LocalDateTime createdAt
    ) {
    }

    public record CreateRequestDto(
            @NotNull(message = "Choose a teacher") Long teacherId,
            @NotNull(message = "Choose a skill") Long skillId,
            @NotNull(message = "Choose how many hours") @Min(value = 1, message = "Minimum is 1 hour")
            @Max(value = 4, message = "Maximum is 4 hours per session") Integer hours,
            @Size(max = 500, message = "Message can be at most 500 characters") String message
    ) {
    }

    public record ScheduleRequestDto(
            @NotNull(message = "Choose a date and time") @Future(message = "Pick a time in the future")
            LocalDateTime scheduledAt
    ) {
    }

    public record RatingRequestDto(
            @NotNull(message = "Choose a star rating") @Min(value = 1, message = "Choose 1 to 5 stars")
            @Max(value = 5, message = "Choose 1 to 5 stars") Integer stars,
            @Size(max = 300, message = "Comment can be at most 300 characters") String comment
    ) {
    }
}
