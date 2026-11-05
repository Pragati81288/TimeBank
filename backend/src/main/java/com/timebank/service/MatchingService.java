package com.timebank.service;

import com.timebank.dto.MatchDtos.MatchDto;
import com.timebank.model.User;
import com.timebank.model.UserSkill;
import com.timebank.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final UserSkillRepository userSkillRepository;

    @Transactional(readOnly = true)
    public List<MatchDto> matchesFor(User me) {
        Map<Long, List<UserSkill>> skillsByUser = userSkillRepository.findAll().stream()
                .collect(Collectors.groupingBy(us -> us.getUser().getId()));

        List<UserSkill> mine = skillsByUser.getOrDefault(me.getId(), List.of());
        List<UserSkill> myLearn = filterType(mine, UserSkill.SkillType.LEARN);
        List<UserSkill> myTeach = filterType(mine, UserSkill.SkillType.TEACH);

        List<MatchDto> matches = new ArrayList<>();
        for (Map.Entry<Long, List<UserSkill>> entry : skillsByUser.entrySet()) {
            if (entry.getKey().equals(me.getId())) {
                continue;
            }
            List<UserSkill> theirs = entry.getValue();
            Set<Long> theirTeachIds = idsOfType(theirs, UserSkill.SkillType.TEACH);
            Set<Long> theirLearnIds = idsOfType(theirs, UserSkill.SkillType.LEARN);

            List<UserSkill> canTeachMe = myLearn.stream()
                    .filter(us -> theirTeachIds.contains(us.getSkill().getId()))
                    .toList();
            List<UserSkill> wantsFromMe = myTeach.stream()
                    .filter(us -> theirLearnIds.contains(us.getSkill().getId()))
                    .toList();
            if (canTeachMe.isEmpty() && wantsFromMe.isEmpty()) {
                continue;
            }

            double learnShare = myLearn.isEmpty() ? 0 : canTeachMe.size() / (double) myLearn.size();
            double teachShare = myTeach.isEmpty() ? 0 : wantsFromMe.size() / (double) myTeach.size();
            int percent = (int) Math.round((learnShare + teachShare) / 2 * 100);

            User other = theirs.get(0).getUser();
            List<String> canTeachNames = canTeachMe.stream().map(us -> us.getSkill().getName()).toList();
            List<String> wantsNames = wantsFromMe.stream().map(us -> us.getSkill().getName()).toList();
            matches.add(new MatchDto(other.getId(), other.getFullName(), other.getUniversity(),
                    other.getAvatarId(), other.getBio(), percent, canTeachNames, wantsNames,
                    explain(other.getFullName(), canTeachNames, wantsNames)));
        }
        matches.sort(Comparator.comparingInt(MatchDto::matchPercent).reversed());
        return matches;
    }

    private String explain(String name, List<String> canTeachMe, List<String> wantsFromMe) {
        StringBuilder text = new StringBuilder();
        if (!canTeachMe.isEmpty()) {
            text.append(name).append(" can teach you ").append(String.join(", ", canTeachMe)).append(".");
        }
        if (!wantsFromMe.isEmpty()) {
            if (text.length() > 0) {
                text.append(" ");
            }
            text.append(name).append(" wants to learn ").append(String.join(", ", wantsFromMe))
                    .append(" from you.");
        }
        return text.toString();
    }

    private List<UserSkill> filterType(List<UserSkill> skills, UserSkill.SkillType type) {
        return skills.stream().filter(us -> us.getSkillType() == type).toList();
    }

    private Set<Long> idsOfType(List<UserSkill> skills, UserSkill.SkillType type) {
        return skills.stream()
                .filter(us -> us.getSkillType() == type)
                .map(us -> us.getSkill().getId())
                .collect(Collectors.toSet());
    }
}
