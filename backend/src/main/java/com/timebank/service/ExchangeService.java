package com.timebank.service;

import com.timebank.dto.ExchangeDtos.CreateRequestDto;
import com.timebank.dto.ExchangeDtos.ExchangeRequestDto;
import com.timebank.dto.ExchangeDtos.Participant;
import com.timebank.dto.ExchangeDtos.ScheduleRequestDto;
import com.timebank.dto.ExchangeDtos.SessionDto;
import com.timebank.exception.ApiException;
import com.timebank.model.ExchangeRequest;
import com.timebank.model.Session;
import com.timebank.model.Skill;
import com.timebank.model.User;
import com.timebank.model.UserSkill;
import com.timebank.repository.ExchangeRequestRepository;
import com.timebank.repository.RatingRepository;
import com.timebank.repository.SessionRepository;
import com.timebank.repository.SkillRepository;
import com.timebank.repository.UserRepository;
import com.timebank.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExchangeService {

    private static final List<ExchangeRequest.Status> ACTIVE = List.of(ExchangeRequest.Status.PENDING, ExchangeRequest.Status.ACCEPTED);
    private static final DateTimeFormatter WHEN = DateTimeFormatter.ofPattern("EEE d MMM, HH:mm");

    private final ExchangeRequestRepository requests;
    private final SessionRepository sessions;
    private final RatingRepository ratings;
    private final UserRepository users;
    private final SkillRepository skills;
    private final UserSkillRepository userSkills;
    private final WalletService wallets;
    private final NotificationService notifications;

    @Transactional(readOnly = true)
    public List<ExchangeRequestDto> listRequests(User me) {
        Map<Long, Session> sessionByRequest = sessions
                .findByRequestLearnerIdOrRequestTeacherIdOrderByScheduledAtAsc(me.getId(), me.getId()).stream()
                .collect(Collectors.toMap(s -> s.getRequest().getId(), s -> s));
        Set<Long> ratedSessionIds = ratedSessionIds(me);
        return requests.findByLearnerIdOrTeacherIdOrderByCreatedAtDesc(me.getId(), me.getId()).stream()
                .map(r -> {
                    Session s = sessionByRequest.get(r.getId());
                    return toDto(r, me, s, isRateable(s, ratedSessionIds));
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SessionDto> listSessions(User me) {
        Set<Long> ratedSessionIds = ratedSessionIds(me);
        return sessions.findByRequestLearnerIdOrRequestTeacherIdOrderByScheduledAtAsc(me.getId(), me.getId()).stream()
                .map(s -> {
                    ExchangeRequest r = s.getRequest();
                    boolean teacher = r.getTeacher().getId().equals(me.getId());
                    User partner = teacher ? r.getLearner() : r.getTeacher();
                    return new SessionDto(s.getId(), r.getId(), r.getSkill().getName(), partner.getFullName(), partner.getAvatarId(),
                            teacher ? "TEACHER" : "LEARNER", s.getScheduledAt(), s.getHours(), s.getStatus().name(),
                            isRateable(s, ratedSessionIds));
                })
                .toList();
    }

    @Transactional
    public ExchangeRequestDto create(User me, CreateRequestDto dto) {
        if (dto.teacherId().equals(me.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You can't request a session from yourself");
        }
        User teacher = users.findById(dto.teacherId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Teacher not found"));
        Skill skill = skills.findById(dto.skillId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Skill not found"));
        if (!userSkills.existsByUserIdAndSkillIdAndSkillType(teacher.getId(), skill.getId(), UserSkill.SkillType.TEACH)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This teacher does not offer that skill");
        }
        if (requests.existsByLearnerIdAndTeacherIdAndSkillIdAndStatusIn(me.getId(), teacher.getId(), skill.getId(), ACTIVE)) {
            throw new ApiException(HttpStatus.CONFLICT, "You already have an active request for this skill with this teacher");
        }
        int hours = dto.hours();
        int balance = wallets.balanceOf(me);
        if (balance < hours) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You need " + hours + " time credit(s) for this session but have "
                    + balance + ". Teach a session to earn credits first.");
        }

        ExchangeRequest request = new ExchangeRequest();
        request.setLearner(me);
        request.setTeacher(teacher);
        request.setSkill(skill);
        request.setHours(hours);
        request.setMessage(blankToNull(dto.message()));
        request = requests.save(request);

        notifications.notify(teacher, me.getFullName() + " requested a " + hours + "h " + skill.getName() + " session.");
        return toDto(request, me, null, false);
    }

    @Transactional
    public ExchangeRequestDto accept(User me, Long id) {
        ExchangeRequest request = requireTeacherRequest(me, id);
        requireStatus(request, ExchangeRequest.Status.PENDING);
        request.setStatus(ExchangeRequest.Status.ACCEPTED);
        request.setUpdatedAt(LocalDateTime.now());
        notifications.notify(request.getLearner(), me.getFullName() + " accepted your " + request.getSkill().getName()
                + " request. Pick a time to schedule it.");
        return dtoFor(me, request);
    }

    @Transactional
    public ExchangeRequestDto reject(User me, Long id) {
        ExchangeRequest request = requireTeacherRequest(me, id);
        requireStatus(request, ExchangeRequest.Status.PENDING);
        request.setStatus(ExchangeRequest.Status.REJECTED);
        request.setUpdatedAt(LocalDateTime.now());
        notifications.notify(request.getLearner(), me.getFullName() + " declined your " + request.getSkill().getName()
                + " request.");
        return dtoFor(me, request);
    }

    @Transactional
    public ExchangeRequestDto cancel(User me, Long id) {
        ExchangeRequest request = findParticipantRequest(me, id);
        if (request.getStatus() != ExchangeRequest.Status.PENDING && request.getStatus() != ExchangeRequest.Status.ACCEPTED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only pending or accepted requests can be cancelled");
        }
        sessions.findByRequestId(request.getId()).ifPresent(session -> {
            if (session.getStatus() == Session.Status.SCHEDULED) {
                sessions.delete(session);
            }
        });
        request.setStatus(ExchangeRequest.Status.CANCELLED);
        request.setUpdatedAt(LocalDateTime.now());
        User other = otherParticipant(request, me);
        notifications.notify(other, me.getFullName() + " cancelled the " + request.getSkill().getName() + " request.");
        return dtoFor(me, request);
    }

    @Transactional
    public ExchangeRequestDto schedule(User me, Long id, ScheduleRequestDto dto) {
        ExchangeRequest request = findParticipantRequest(me, id);
        requireStatus(request, ExchangeRequest.Status.ACCEPTED);
        if (sessions.findByRequestId(request.getId()).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "This session is already scheduled");
        }
        Session session = sessions.save(new Session(request, dto.scheduledAt(), request.getHours()));
        notifications.notify(otherParticipant(request, me), "Your " + request.getSkill().getName() + " session is set for "
                + dto.scheduledAt().format(WHEN) + ".");
        return dtoFor(me, request, session);
    }

    @Transactional
    public ExchangeRequestDto complete(User me, Long id) {
        ExchangeRequest request = findParticipantRequest(me, id);
        requireStatus(request, ExchangeRequest.Status.ACCEPTED);
        Session session = sessions.findByRequestId(request.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Schedule the session before marking it completed"));
        if (session.getStatus() != Session.Status.SCHEDULED) {
            throw new ApiException(HttpStatus.CONFLICT, "This session is already completed");
        }

        session.setStatus(Session.Status.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        request.setStatus(ExchangeRequest.Status.COMPLETED);
        request.setUpdatedAt(LocalDateTime.now());

        String skillName = request.getSkill().getName();
        int hours = session.getHours();
        wallets.debit(request.getLearner(), hours, "SESSION-" + session.getId() + "-SPEND",
                "Learned " + skillName + " from " + request.getTeacher().getFullName());
        wallets.credit(request.getTeacher(), hours, "SESSION-" + session.getId() + "-EARN",
                "Taught " + skillName + " to " + request.getLearner().getFullName());

        notifications.notify(request.getLearner(), "Session completed. " + hours + " time credit(s) were spent.");
        notifications.notify(request.getTeacher(), "Session completed. You earned " + hours + " time credit(s).");
        return dtoFor(me, request, session);
    }

    private ExchangeRequest requireTeacherRequest(User me, Long id) {
        return requests.findByIdAndTeacherId(id, me.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Request not found"));
    }

    private ExchangeRequest findParticipantRequest(User me, Long id) {
        return requests.findById(id)
                .filter(r -> r.getLearner().getId().equals(me.getId()) || r.getTeacher().getId().equals(me.getId()))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Request not found"));
    }

    private void requireStatus(ExchangeRequest request, ExchangeRequest.Status expected) {
        if (request.getStatus() != expected) {
            throw new ApiException(HttpStatus.CONFLICT, "This request is no longer " + expected.name().toLowerCase());
        }
    }

    private User otherParticipant(ExchangeRequest request, User me) {
        return request.getLearner().getId().equals(me.getId()) ? request.getTeacher() : request.getLearner();
    }

    private Set<Long> ratedSessionIds(User me) {
        return ratings.findByRaterId(me.getId()).stream()
                .map(r -> r.getSession().getId())
                .collect(Collectors.toSet());
    }

    private boolean isRateable(Session session, Set<Long> ratedSessionIds) {
        return session != null && session.getStatus() == Session.Status.COMPLETED
                && !ratedSessionIds.contains(session.getId());
    }

    private ExchangeRequestDto dtoFor(User me, ExchangeRequest request) {
        return dtoFor(me, request, sessions.findByRequestId(request.getId()).orElse(null));
    }

    private ExchangeRequestDto dtoFor(User me, ExchangeRequest request, Session session) {
        boolean rateable = session != null && session.getStatus() == Session.Status.COMPLETED
                && !ratings.existsBySessionIdAndRaterId(session.getId(), me.getId());
        return toDto(request, me, session, rateable);
    }

    private ExchangeRequestDto toDto(ExchangeRequest request, User me, Session session, boolean rateable) {
        boolean teacher = request.getTeacher().getId().equals(me.getId());
        return new ExchangeRequestDto(
                request.getId(),
                participant(request.getLearner()),
                participant(request.getTeacher()),
                request.getSkill().getName(),
                request.getHours(),
                request.getMessage(),
                request.getStatus().name(),
                teacher ? "TEACHER" : "LEARNER",
                request.getCreatedAt(),
                session == null ? null : session.getId(),
                session == null ? null : session.getScheduledAt(),
                session == null ? null : session.getStatus().name(),
                rateable);
    }

    private Participant participant(User user) {
        return new Participant(user.getId(), user.getFullName(), user.getAvatarId());
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
