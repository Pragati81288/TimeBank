package com.timebank.dto;

import com.timebank.model.SkillCategory;
import com.timebank.model.UserSkill;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class SkillDtos {

    private SkillDtos() {
    }

    public record SkillDto(Long id, String name, String category, String description) {
    }

    public record UserSkillDto(
            Long id,
            Long skillId,
            String name,
            String category,
            String skillType,
            String level,
            String details,
            Long ownerId,
            String ownerName,
            String ownerAvatarId
    ) {
        public static UserSkillDto from(UserSkill userSkill) {
            return new UserSkillDto(
                    userSkill.getId(),
                    userSkill.getSkill().getId(),
                    userSkill.getSkill().getName(),
                    userSkill.getSkill().getCategory().name(),
                    userSkill.getSkillType().name(),
                    userSkill.getLevel(),
                    userSkill.getDetails(),
                    userSkill.getUser().getId(),
                    userSkill.getUser().getFullName(),
                    userSkill.getUser().getAvatarId()
            );
        }
    }

    public record UserSkillRequest(
            @NotBlank(message = "Please enter a skill name")
            @Size(min = 2, max = 100, message = "Skill name must be between 2 and 100 characters")
            String skillName,

            @NotNull(message = "Please choose a category") SkillCategory category,
            @NotNull(message = "Choose whether you teach or want to learn this skill") UserSkill.SkillType skillType,

            @NotBlank
            @Pattern(regexp = "Beginner|Intermediate|Advanced|Expert", message = "Choose a valid level")
            String level,

            @Size(max = 300, message = "Details can be at most 300 characters") String details
    ) {
    }

    public record UpdateUserSkillRequest(
            @NotBlank
            @Pattern(regexp = "Beginner|Intermediate|Advanced|Expert", message = "Choose a valid level")
            String level,

            @Size(max = 300, message = "Details can be at most 300 characters") String details
    ) {
    }
}
