package com.timebank.dto;

import java.util.List;

public final class MatchDtos {

    private MatchDtos() {
    }

    public record MatchDto(
            Long userId,
            String fullName,
            String university,
            String avatarId,
            String bio,
            int matchPercent,
            List<String> canTeachYou,
            List<String> wantsFromYou,
            String explanation
    ) {
    }
}
