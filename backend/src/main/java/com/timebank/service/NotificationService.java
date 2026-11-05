package com.timebank.service;

import com.timebank.dto.NotificationDtos.NotificationDto;
import com.timebank.exception.ApiException;
import com.timebank.model.Notification;
import com.timebank.model.User;
import com.timebank.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void notify(User user, String message) {
        notificationRepository.save(new Notification(user, message));
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> list(User user) {
        return notificationRepository.findTop30ByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public long unreadCount(User user) {
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    @Transactional
    public void markRead(User user, Long id) {
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Notification not found"));
        notification.setRead(true);
    }

    @Transactional
    public void markAllRead(User user) {
        notificationRepository.findByUserIdAndReadFalse(user.getId())
                .forEach(notification -> notification.setRead(true));
    }

    private NotificationDto toDto(Notification notification) {
        return new NotificationDto(notification.getId(), notification.getMessage(),
                notification.isRead(), notification.getCreatedAt());
    }
}
