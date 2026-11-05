package com.timebank.repository;

import com.timebank.model.Skill;
import com.timebank.model.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findByNameIgnoreCase(String name);

    List<Skill> findByCategoryOrderByNameAsc(SkillCategory category);

    List<Skill> findAllByOrderByNameAsc();
}
