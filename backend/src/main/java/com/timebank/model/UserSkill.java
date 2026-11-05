package com.timebank.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

@Entity
@Table(name = "user_skills", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "skill_id", "skill_type"}))
@Getter
@Setter
@NoArgsConstructor
public class UserSkill {

    public enum SkillType {
        TEACH,
        LEARN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_type", nullable = false, length = 10)
    private SkillType skillType;

    @Column(nullable = false, length = 20)
    private String level = "Intermediate";

    @Column(length = 300)
    private String details;

    public UserSkill(User user, Skill skill, SkillType skillType, String level, String details) {
        this.user = user;
        this.skill = skill;
        this.skillType = skillType;
        this.level = level;
        this.details = details;
    }
}
