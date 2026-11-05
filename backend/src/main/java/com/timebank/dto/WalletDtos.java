package com.timebank.dto;

import java.time.LocalDateTime;

public final class WalletDtos {

    private WalletDtos() {
    }

    public record WalletDto(int balance, int totalEarned, int totalSpent) {
    }

    public record TransactionDto(
            Long id,
            String type,
            int amount,
            int balanceAfter,
            String description,
            LocalDateTime createdAt
    ) {
    }
}
