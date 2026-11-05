package com.timebank.controller;

import com.timebank.dto.DashboardDtos.DashboardDto;
import com.timebank.dto.UserDtos.PublicStats;
import com.timebank.dto.UserDtos.UpdateProfileRequest;
import com.timebank.dto.UserDtos.UpdateSettingsRequest;
import com.timebank.dto.UserDtos.UserDto;
import com.timebank.dto.ExchangeDtos.RatingDto;
import com.timebank.service.DashboardService;
import com.timebank.service.RatingService;
import com.timebank.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final DashboardService dashboardService;
    private final RatingService ratingService;

    @GetMapping("/api/users/me")
    public UserDto me(Authentication authentication) {
        return UserDto.from(userService.currentUser(authentication));
    }

    @PutMapping("/api/users/me")
    public UserDto updateProfile(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(userService.currentUser(authentication), request);
    }

    @PutMapping("/api/users/me/settings")
    public UserDto updateSettings(Authentication authentication, @Valid @RequestBody UpdateSettingsRequest request) {
        return userService.updateSettings(userService.currentUser(authentication), request);
    }

    @GetMapping("/api/users/me/dashboard")
    public DashboardDto dashboard(Authentication authentication) {
        return dashboardService.dashboard(userService.currentUser(authentication));
    }

    @GetMapping("/api/users/{id}/ratings")
    public List<RatingDto> ratings(Authentication authentication, @PathVariable Long id) {
        userService.currentUser(authentication);
        return ratingService.receivedBy(id);
    }

    @GetMapping("/api/public/stats")
    public PublicStats stats() {
        return userService.publicStats();
    }
}
