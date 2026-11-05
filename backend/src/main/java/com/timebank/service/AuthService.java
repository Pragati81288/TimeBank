package com.timebank.service;

import com.timebank.dto.AuthDtos.AuthResponse;
import com.timebank.dto.AuthDtos.LoginRequest;
import com.timebank.dto.AuthDtos.RegisterRequest;
import com.timebank.dto.UserDtos.UserDto;
import com.timebank.exception.ApiException;
import com.timebank.model.User;
import com.timebank.repository.UserRepository;
import com.timebank.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WalletService walletService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setUniversity(blankToNull(request.university()));
        user.setLocation(blankToNull(request.location()));
        user.setAvatarId(String.format(Locale.ROOT, "avatar-%02d", userRepository.count() % 16 + 1));
        user = userRepository.save(user);
        walletService.grantWelcomeBonus(user);
        notificationService.notify(user, "Welcome to TimeBank! We added " + WalletService.WELCOME_BONUS_CREDITS
                + " time credits to your wallet to get you started.");
        return new AuthResponse(jwtService.generateToken(email), UserDto.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmailIgnoreCase(email)
                .filter(found -> passwordEncoder.matches(request.password(), found.getPasswordHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Incorrect email or password"));
        return new AuthResponse(jwtService.generateToken(user.getEmail()), UserDto.from(user));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
