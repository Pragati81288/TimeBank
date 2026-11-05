package com.timebank.repository;

import com.timebank.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    boolean existsBySessionIdAndRaterId(Long sessionId, Long raterId);

    List<Rating> findByRateeIdOrderByCreatedAtDesc(Long rateeId);

    List<Rating> findByRaterId(Long raterId);
}
