package com.timebank.service;

import com.timebank.dto.SkillDtos.SkillDto;
import com.timebank.dto.SkillDtos.UpdateUserSkillRequest;
import com.timebank.dto.SkillDtos.UserSkillDto;
import com.timebank.dto.SkillDtos.UserSkillRequest;
import com.timebank.exception.ApiException;
import com.timebank.model.Skill;
import com.timebank.model.SkillCategory;
import com.timebank.model.User;
import com.timebank.model.UserSkill;
import com.timebank.repository.SkillRepository;
import com.timebank.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    @Transactional(readOnly = true)
    public List<SkillDto> catalog(SkillCategory category) {
        List<Skill> skills = category == null
                ? skillRepository.findAllByOrderByNameAsc()
                : skillRepository.findByCategoryOrderByNameAsc(category);
        return skills.stream()
                .map(skill -> new SkillDto(skill.getId(), skill.getName(), skill.getCategory().name(), skill.getDescription()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserSkillDto> browse(User viewer, String query, SkillCategory category) {
        String needle = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        return userSkillRepository.findBySkillType(UserSkill.SkillType.TEACH).stream()
                .filter(offer -> !offer.getUser().getId().equals(viewer.getId()))
                .filter(offer -> needle.isEmpty() || offer.getSkill().getName().toLowerCase(Locale.ROOT).contains(needle))
                .filter(offer -> category == null || offer.getSkill().getCategory() == category)
                .map(UserSkillDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserSkillDto> mySkills(User user, UserSkill.SkillType type) {
        return userSkillRepository.findByUserIdAndSkillTypeOrderBySkillNameAsc(user.getId(), type).stream()
                .map(UserSkillDto::from)
                .toList();
    }

    @Transactional
    public UserSkillDto addSkill(User user, UserSkillRequest request) {
        String name = request.skillName().trim();
        Skill skill = skillRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> skillRepository.save(new Skill(name, request.category(), null)));
        if (userSkillRepository.existsByUserIdAndSkillIdAndSkillType(user.getId(), skill.getId(), request.skillType())) {
            throw new ApiException(HttpStatus.CONFLICT, "You have already added " + skill.getName() + " to this list");
        }
        UserSkill userSkill = new UserSkill(user, skill, request.skillType(), request.level(), blankToNull(request.details()));
        return UserSkillDto.from(userSkillRepository.save(userSkill));
    }

    @Transactional
    public UserSkillDto updateSkill(User user, Long id, UpdateUserSkillRequest request) {
        UserSkill userSkill = findOwned(user, id);
        userSkill.setLevel(request.level());
        userSkill.setDetails(blankToNull(request.details()));
        return UserSkillDto.from(userSkillRepository.save(userSkill));
    }

    @Transactional
    public void deleteSkill(User user, Long id) {
        userSkillRepository.delete(findOwned(user, id));
    }

    private UserSkill findOwned(User user, Long id) {
        return userSkillRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Skill not found"));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
