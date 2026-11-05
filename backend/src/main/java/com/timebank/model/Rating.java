package com.timebank.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = @UniqueConstraint(columnNames = {"session_id", "rater_id"}))
@Getter
@Setter
@NoArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(optional = false)
    @JoinColumn(name = "rater_id", nullable = false)
    private User rater;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ratee_id", nullable = false)
    private User ratee;

    @Column(nullable = false)
    private int stars;

    @Column(length = 300)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
