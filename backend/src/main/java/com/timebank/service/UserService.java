package com.timebank.service;

import com.timebank.dto.UserDtos.PublicStats;
import com.timebank.dto.UserDtos.UpdateProfileRequest;
import com.timebank.dto.UserDtos.UpdateSettingsRequest;
import com.timebank.dto.UserDtos.UserDto;
import com.timebank.exception.ApiException;
import com.timebank.model.Session;
import com.timebank.model.User;
import com.timebank.model.UserSkill;
import com.timebank.repository.SessionRepository;
import com.timebank.repository.UserRepository;
import com.timebank.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final SessionRepository sessionRepository;

    @Transactional(readOnly = true)
    public User currentUser(Authentication authentication) {
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Please sign in to continue"));
    }

    @Transactional(readOnly = true)
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found"));
    }

    @Transactional
    public UserDto updateProfile(User user, UpdateProfileRequest request) {
        user.setFullName(request.fullName().trim());
        user.setBio(blankToNull(request.bio()));
        user.setUniversity(blankToNull(request.university()));
        user.setLocation(blankToNull(request.location()));
        if (request.avatarId() != null) {
            user.setAvatarId(request.avatarId());
        }
        return UserDto.from(userRepository.save(user));
    }

    @Transactional
    public UserDto updateSettings(User user, UpdateSettingsRequest request) {
        user.setTheme(request.theme());
        user.setLanguage(request.language());
        return UserDto.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public PublicStats publicStats() {
        long hours = sessionRepository.findByStatus(Session.Status.COMPLETED).stream()
                .mapToLong(Session::getHours)
                .sum();
        return new PublicStats(
                userRepository.count(),
                userSkillRepository.countBySkillType(UserSkill.SkillType.TEACH),
                sessionRepository.countByStatus(Session.Status.COMPLETED),
                hours);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
