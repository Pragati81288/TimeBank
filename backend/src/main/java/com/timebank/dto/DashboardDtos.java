package com.timebank.dto;

import com.timebank.dto.ExchangeDtos.ExchangeRequestDto;
import com.timebank.dto.ExchangeDtos.SessionDto;
import com.timebank.dto.MatchDtos.MatchDto;
import com.timebank.dto.NotificationDtos.NotificationDto;
import com.timebank.dto.SkillDtos.UserSkillDto;
import com.timebank.dto.UserDtos.UserDto;
import com.timebank.dto.WalletDtos.WalletDto;

import java.util.List;

public final class DashboardDtos {

    private DashboardDtos() {
    }

    public record BadgeDto(String key, String title, String description, boolean earned) {
    }

    public record DashboardDto(
            UserDto user,
            WalletDto wallet,
            List<UserSkillDto> teaching,
            List<UserSkillDto> learning,
            List<MatchDto> recommendedMatches,
            List<ExchangeRequestDto> pendingRequests,
            List<SessionDto> upcomingSessions,
            List<NotificationDto> recentActivity,
            List<BadgeDto> badges,
            double averageRating,
            int ratingCount,
            long unreadNotifications
    ) {
    }
}
