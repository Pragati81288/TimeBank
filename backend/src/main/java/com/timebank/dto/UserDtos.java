package com.timebank.dto;

import com.timebank.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public final class UserDtos {

    private UserDtos() {
    }

    public record UserDto(
            Long id,
            String fullName,
            String email,
            String bio,
            String university,
            String location,
            String avatarId,
            String theme,
            String language,
            LocalDateTime createdAt
    ) {
        public static UserDto from(User user) {
            return new UserDto(user.getId(), user.getFullName(), user.getEmail(), user.getBio(),
                    user.getUniversity(), user.getLocation(), user.getAvatarId(), user.getTheme(),
                    user.getLanguage(), user.getCreatedAt());
        }
    }

    public record UpdateProfileRequest(
            @NotBlank(message = "Please enter your full name")
            @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
            String fullName,

            @Size(max = 500, message = "Bio can be at most 500 characters") String bio,
            @Size(max = 150) String university,
            @Size(max = 100) String location,

            @Pattern(regexp = "avatar-(0[1-9]|1[0-6])", message = "Choose a valid avatar")
            String avatarId
    ) {
    }

    public record UpdateSettingsRequest(
            @NotBlank
            @Pattern(regexp = "strawberry-milk|lavender-dreams|peach-blossom|baby-blue|mint-garden|cream-minimal|midnight-mode",
                    message = "Choose a valid theme")
            String theme,

            @NotBlank
            @Pattern(regexp = "en|hi|pa|fr|es", message = "Choose a valid language")
            String language
    ) {
    }

    public record PublicStats(long students, long skillOffers, long sessionsCompleted, long hoursExchanged) {
    }
}
