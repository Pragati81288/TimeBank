package com.timebank.service;

import com.timebank.dto.ExchangeDtos.RatingDto;
import com.timebank.dto.ExchangeDtos.RatingRequestDto;
import com.timebank.exception.ApiException;
import com.timebank.model.ExchangeRequest;
import com.timebank.model.Rating;
import com.timebank.model.Session;
import com.timebank.model.User;
import com.timebank.repository.ExchangeRequestRepository;
import com.timebank.repository.RatingRepository;
import com.timebank.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratings;
    private final ExchangeRequestRepository requests;
    private final SessionRepository sessions;
    private final NotificationService notifications;

    @Transactional
    public RatingDto rate(User me, Long requestId, RatingRequestDto dto) {
        ExchangeRequest request = requests.findById(requestId)
                .filter(r -> r.getLearner().getId().equals(me.getId()) || r.getTeacher().getId().equals(me.getId()))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Request not found"));
        Session session = sessions.findByRequestId(request.getId())
                .filter(s -> s.getStatus() == Session.Status.COMPLETED)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "You can rate a session once it is completed"));
        if (ratings.existsBySessionIdAndRaterId(session.getId(), me.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "You have already rated this session");
        }

        User ratee = request.getLearner().getId().equals(me.getId()) ? request.getTeacher() : request.getLearner();
        Rating rating = new Rating();
        rating.setSession(session);
        rating.setRater(me);
        rating.setRatee(ratee);
        rating.setStars(dto.stars());
        rating.setComment(dto.comment() == null || dto.comment().isBlank() ? null : dto.comment().trim());
        rating = ratings.save(rating);

        notifications.notify(ratee, me.getFullName() + " rated your " + request.getSkill().getName()
                + " session " + rating.getStars() + " star(s).");
        return toDto(rating);
    }

    @Transactional(readOnly = true)
    public List<RatingDto> receivedBy(Long userId) {
        return ratings.findByRateeIdOrderByCreatedAtDesc(userId).stream().map(this::toDto).toList();
    }

    private RatingDto toDto(Rating rating) {
        return new RatingDto(rating.getId(), rating.getRater().getFullName(), rating.getStars(),
                rating.getComment(), rating.getSession().getRequest().getSkill().getName(), rating.getCreatedAt());
    }
}
