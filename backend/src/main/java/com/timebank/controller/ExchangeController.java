package com.timebank.controller;

import com.timebank.dto.ExchangeDtos.CreateRequestDto;
import com.timebank.dto.ExchangeDtos.ExchangeRequestDto;
import com.timebank.dto.ExchangeDtos.RatingDto;
import com.timebank.dto.ExchangeDtos.RatingRequestDto;
import com.timebank.dto.ExchangeDtos.ScheduleRequestDto;
import com.timebank.dto.ExchangeDtos.SessionDto;
import com.timebank.dto.WalletDtos.TransactionDto;
import com.timebank.dto.WalletDtos.WalletDto;
import com.timebank.dto.NotificationDtos.NotificationDto;
import com.timebank.service.ExchangeService;
import com.timebank.service.NotificationService;
import com.timebank.service.RatingService;
import com.timebank.service.UserService;
import com.timebank.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExchangeController {

    private final ExchangeService exchangeService;
    private final RatingService ratingService;
    private final WalletService walletService;
    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping("/api/exchanges")
    public List<ExchangeRequestDto> requests(Authentication authentication) {
        return exchangeService.listRequests(userService.currentUser(authentication));
    }

    @PostMapping("/api/exchanges")
    @ResponseStatus(HttpStatus.CREATED)
    public ExchangeRequestDto create(Authentication authentication, @Valid @RequestBody CreateRequestDto request) {
        return exchangeService.create(userService.currentUser(authentication), request);
    }

    @PostMapping("/api/exchanges/{id}/accept")
    public ExchangeRequestDto accept(Authentication authentication, @PathVariable Long id) {
        return exchangeService.accept(userService.currentUser(authentication), id);
    }

    @PostMapping("/api/exchanges/{id}/reject")
    public ExchangeRequestDto reject(Authentication authentication, @PathVariable Long id) {
        return exchangeService.reject(userService.currentUser(authentication), id);
    }

    @PostMapping("/api/exchanges/{id}/cancel")
    public ExchangeRequestDto cancel(Authentication authentication, @PathVariable Long id) {
        return exchangeService.cancel(userService.currentUser(authentication), id);
    }

    @PostMapping("/api/exchanges/{id}/schedule")
    public ExchangeRequestDto schedule(Authentication authentication, @PathVariable Long id,
                                       @Valid @RequestBody ScheduleRequestDto request) {
        return exchangeService.schedule(userService.currentUser(authentication), id, request);
    }

    @PostMapping("/api/exchanges/{id}/complete")
    public ExchangeRequestDto complete(Authentication authentication, @PathVariable Long id) {
        return exchangeService.complete(userService.currentUser(authentication), id);
    }

    @PostMapping("/api/exchanges/{id}/rate")
    public RatingDto rate(Authentication authentication, @PathVariable Long id,
                          @Valid @RequestBody RatingRequestDto request) {
        return ratingService.rate(userService.currentUser(authentication), id, request);
    }

    @GetMapping("/api/sessions")
    public List<SessionDto> sessions(Authentication authentication) {
        return exchangeService.listSessions(userService.currentUser(authentication));
    }

    @GetMapping("/api/wallet")
    public WalletDto wallet(Authentication authentication) {
        return walletService.walletFor(userService.currentUser(authentication));
    }

    @GetMapping("/api/wallet/transactions")
    public List<TransactionDto> transactions(Authentication authentication) {
        return walletService.history(userService.currentUser(authentication));
    }

    @GetMapping("/api/notifications")
    public List<NotificationDto> notifications(Authentication authentication) {
        return notificationService.list(userService.currentUser(authentication));
    }

    @PostMapping("/api/notifications/{id}/read")
    public void markRead(Authentication authentication, @PathVariable Long id) {
        notificationService.markRead(userService.currentUser(authentication), id);
    }

    @PostMapping("/api/notifications/read-all")
    public void markAllRead(Authentication authentication) {
        notificationService.markAllRead(userService.currentUser(authentication));
    }
}
