package com.timebank.repository;

import com.timebank.model.Transaction;
import com.timebank.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByWalletOrderByCreatedAtDesc(Wallet wallet);

    boolean existsByReference(String reference);
}
