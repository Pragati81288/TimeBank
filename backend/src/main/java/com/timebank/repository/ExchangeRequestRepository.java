package com.timebank.repository;

import com.timebank.model.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {

    List<ExchangeRequest> findByLearnerIdOrTeacherIdOrderByCreatedAtDesc(Long learnerId, Long teacherId);

    Optional<ExchangeRequest> findByIdAndTeacherId(Long id, Long teacherId);

    boolean existsByLearnerIdAndTeacherIdAndSkillIdAndStatusIn(Long learnerId, Long teacherId, Long skillId,
                                                              Collection<ExchangeRequest.Status> statuses);
}
