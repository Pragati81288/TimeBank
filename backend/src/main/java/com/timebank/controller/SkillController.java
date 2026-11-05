package com.timebank.controller;

import com.timebank.dto.SkillDtos.SkillDto;
import com.timebank.dto.SkillDtos.UpdateUserSkillRequest;
import com.timebank.dto.SkillDtos.UserSkillDto;
import com.timebank.dto.SkillDtos.UserSkillRequest;
import com.timebank.dto.MatchDtos.MatchDto;
import com.timebank.model.SkillCategory;
import com.timebank.model.User;
import com.timebank.model.UserSkill;
import com.timebank.service.MatchingService;
import com.timebank.service.SkillService;
import com.timebank.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;
    private final UserService userService;
    private final MatchingService matchingService;

    @GetMapping("/api/skills")
    public List<SkillDto> catalog(@RequestParam(required = false) SkillCategory category) {
        return skillService.catalog(category);
    }

    @GetMapping("/api/skills/browse")
    public List<UserSkillDto> browse(Authentication authentication,
                                     @RequestParam(required = false) String q,
                                     @RequestParam(required = false) SkillCategory category) {
        return skillService.browse(userService.currentUser(authentication), q, category);
    }

    @GetMapping("/api/skills/mine")
    public List<UserSkillDto> mine(Authentication authentication) {
        User user = userService.currentUser(authentication);
        List<UserSkillDto> all = new ArrayList<>(skillService.mySkills(user, UserSkill.SkillType.TEACH));
        all.addAll(skillService.mySkills(user, UserSkill.SkillType.LEARN));
        return all;
    }

    @PostMapping("/api/skills/mine")
    @ResponseStatus(HttpStatus.CREATED)
    public UserSkillDto add(Authentication authentication, @Valid @RequestBody UserSkillRequest request) {
        return skillService.addSkill(userService.currentUser(authentication), request);
    }

    @PutMapping("/api/skills/mine/{id}")
    public UserSkillDto update(Authentication authentication, @PathVariable Long id,
                               @Valid @RequestBody UpdateUserSkillRequest request) {
        return skillService.updateSkill(userService.currentUser(authentication), id, request);
    }

    @DeleteMapping("/api/skills/mine/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        skillService.deleteSkill(userService.currentUser(authentication), id);
    }

    @GetMapping("/api/matches")
    public List<MatchDto> matches(Authentication authentication) {
        return matchingService.matchesFor(userService.currentUser(authentication));
    }
}
