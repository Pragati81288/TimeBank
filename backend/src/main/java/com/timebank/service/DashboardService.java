package com.timebank.service;

import com.timebank.dto.DashboardDtos.BadgeDto;
import com.timebank.dto.DashboardDtos.DashboardDto;
import com.timebank.dto.ExchangeDtos.ExchangeRequestDto;
import com.timebank.dto.ExchangeDtos.RatingDto;
import com.timebank.dto.ExchangeDtos.SessionDto;
import com.timebank.dto.MatchDtos.MatchDto;
import com.timebank.dto.NotificationDtos.NotificationDto;
import com.timebank.dto.SkillDtos.UserSkillDto;
import com.timebank.dto.UserDtos.UserDto;
import com.timebank.dto.WalletDtos.WalletDto;
import com.timebank.model.ExchangeRequest;
import com.timebank.model.User;
import com.timebank.model.UserSkill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WalletService wallets;
    private final SkillService skills;
    private final MatchingService matching;
    private final ExchangeService exchanges;
    private final NotificationService notifications;
    private final RatingService ratings;

    @Transactional(readOnly = true)
    public DashboardDto dashboard(User me) {
        WalletDto wallet = wallets.walletFor(me);
        List<UserSkillDto> teaching = skills.mySkills(me, UserSkill.SkillType.TEACH);
        List<UserSkillDto> learning = skills.mySkills(me, UserSkill.SkillType.LEARN);
        List<MatchDto> matches = matching.matchesFor(me).stream().limit(3).toList();
        List<ExchangeRequestDto> pending = exchanges.listRequests(me).stream()
                .filter(r -> r.status().equals(ExchangeRequest.Status.PENDING.name()))
                .toList();
        List<SessionDto> upcoming = exchanges.listSessions(me).stream()
                .filter(s -> s.status().equals("SCHEDULED"))
                .limit(5)
                .toList();
        List<NotificationDto> activity = notifications.list(me).stream().limit(8).toList();
        List<RatingDto> received = ratings.receivedBy(me.getId());
        double average = received.stream().mapToInt(RatingDto::stars).average().orElse(0);
        long completed = exchanges.listSessions(me).stream().filter(s -> s.status().equals("COMPLETED")).count();

        return new DashboardDto(
                UserDto.from(me),
                wallet,
                teaching,
                learning,
                matches,
                pending,
                upcoming,
                activity,
                badges(wallet, teaching.size(), completed, average, received.size()),
                Math.round(average * 10) / 10.0,
                received.size(),
                notifications.unreadCount(me));
    }

    private List<BadgeDto> badges(WalletDto wallet, int offers, long completed, double average, int ratingCount) {
        return List.of(
                new BadgeDto("first-exchange", "First Exchange", "Complete your first session", completed >= 1),
                new BadgeDto("generous-teacher", "Generous Teacher", "Earn 5 credits by teaching", wallet.totalEarned() >= 5),
                new BadgeDto("eager-learner", "Eager Learner", "Spend 5 credits on learning", wallet.totalSpent() >= 5),
                new BadgeDto("skill-sharer", "Skill Sharer", "Offer 3 skills to teach", offers >= 3),
                new BadgeDto("well-rated", "Well Rated", "Average 4.5 stars over 2 ratings", ratingCount >= 2 && average >= 4.5));
    }
}
