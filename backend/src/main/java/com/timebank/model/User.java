package com.timebank.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 500)
    private String bio;

    @Column(length = 150)
    private String university;

    @Column(length = 100)
    private String location;

    @Column(nullable = false, length = 20)
    private String avatarId = "avatar-01";

    @Column(nullable = false, length = 30)
    private String theme = "strawberry-milk";

    @Column(nullable = false, length = 5)
    private String language = "en";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.STUDENT;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        STUDENT,
        ADMIN
    }
}
