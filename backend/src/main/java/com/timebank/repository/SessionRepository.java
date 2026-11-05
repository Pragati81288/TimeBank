package com.timebank.repository;

import com.timebank.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findByRequestId(Long requestId);

    List<Session> findByRequestLearnerIdOrRequestTeacherIdOrderByScheduledAtAsc(Long learnerId, Long teacherId);

    List<Session> findByStatus(Session.Status status);

    long countByStatus(Session.Status status);
}
