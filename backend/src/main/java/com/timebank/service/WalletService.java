package com.timebank.service;

import com.timebank.dto.WalletDtos.TransactionDto;
import com.timebank.dto.WalletDtos.WalletDto;
import com.timebank.exception.ApiException;
import com.timebank.model.Transaction;
import com.timebank.model.User;
import com.timebank.model.Wallet;
import com.timebank.repository.TransactionRepository;
import com.timebank.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletService {

    public static final int WELCOME_BONUS_CREDITS = 10;

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public Wallet getOrCreate(User user) {
        return walletRepository.findByUserId(user.getId())
                .orElseGet(() -> walletRepository.save(new Wallet(user)));
    }

    @Transactional
    public int balanceOf(User user) {
        return getOrCreate(user).getBalance();
    }

    @Transactional
    public WalletDto walletFor(User user) {
        Wallet wallet = getOrCreate(user);
        return new WalletDto(wallet.getBalance(), wallet.getTotalEarned(), wallet.getTotalSpent());
    }

    @Transactional(readOnly = true)
    public List<TransactionDto> history(User user) {
        Wallet wallet = getOrCreate(user);
        return transactionRepository.findByWalletOrderByCreatedAtDesc(wallet).stream()
                .map(t -> new TransactionDto(t.getId(), t.getType().name(), t.getAmount(),
                        t.getBalanceAfter(), t.getDescription(), t.getCreatedAt()))
                .toList();
    }

    @Transactional
    public void credit(User user, int hours, String reference, String description) {
        post(user, Transaction.Type.EARN, hours, reference, description);
    }

    @Transactional
    public void debit(User user, int hours, String reference, String description) {
        post(user, Transaction.Type.SPEND, hours, reference, description);
    }

    @Transactional
    public void grantWelcomeBonus(User user) {
        String reference = welcomeReference(user);
        if (transactionRepository.existsByReference(reference)) {
            return;
        }
        credit(user, WELCOME_BONUS_CREDITS, reference, "Welcome bonus: " + WELCOME_BONUS_CREDITS + " time credits");
    }

    @Transactional
    public void grantWelcomeBonusToEligibleWallets() {
        for (Wallet wallet : walletRepository.findAll()) {
            if (wallet.getBalance() == 0) {
                grantWelcomeBonus(wallet.getUser());
            }
        }
    }

    private String welcomeReference(User user) {
        return "WELCOME-" + user.getId();
    }

    private void post(User user, Transaction.Type type, int amount, String reference, String description) {
        if (transactionRepository.existsByReference(reference)) {
            throw new ApiException(HttpStatus.CONFLICT, "This session has already been settled");
        }
        Wallet wallet = getOrCreate(user);
        if (type == Transaction.Type.SPEND) {
            if (wallet.getBalance() < amount) {
                throw new ApiException(HttpStatus.BAD_REQUEST,
                        "The learner does not have enough time credits for this session");
            }
            wallet.setBalance(wallet.getBalance() - amount);
            wallet.setTotalSpent(wallet.getTotalSpent() + amount);
        } else {
            wallet.setBalance(wallet.getBalance() + amount);
            wallet.setTotalEarned(wallet.getTotalEarned() + amount);
        }
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setBalanceAfter(wallet.getBalance());
        transaction.setDescription(description);
        transaction.setReference(reference);
        transactionRepository.save(transaction);
    }
}
