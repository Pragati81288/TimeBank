package com.timebank.repository;

import com.timebank.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findByUserIdOrderBySkillNameAsc(Long userId);

    List<UserSkill> findByUserIdAndSkillTypeOrderBySkillNameAsc(Long userId, UserSkill.SkillType skillType);

    List<UserSkill> findBySkillType(UserSkill.SkillType skillType);

    Optional<UserSkill> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserIdAndSkillIdAndSkillType(Long userId, Long skillId, UserSkill.SkillType skillType);

    long countBySkillType(UserSkill.SkillType skillType);
}
