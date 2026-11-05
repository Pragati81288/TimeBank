package com.timebank.dto;

import com.timebank.dto.UserDtos.UserDto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank(message = "Please enter your full name")
            @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
            String fullName,

            @NotBlank(message = "Please enter your email")
            @Email(message = "Please enter a valid email address")
            @Size(max = 150)
            String email,

            @NotBlank(message = "Please choose a password")
            @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
            @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Password must include at least one letter and one number")
            String password,

            @Size(max = 150) String university,
            @Size(max = 100) String location
    ) {
    }

    public record LoginRequest(
            @NotBlank(message = "Please enter your email")
            @Email(message = "Please enter a valid email address")
            String email,

            @NotBlank(message = "Please enter your password")
            String password
    ) {
    }

    public record AuthResponse(String token, UserDto user) {
    }
}
