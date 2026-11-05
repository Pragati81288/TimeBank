package com.timebank.config;

import com.timebank.model.ExchangeRequest;
import com.timebank.model.Session;
import com.timebank.model.Skill;
import com.timebank.model.SkillCategory;
import com.timebank.model.User;
import com.timebank.model.UserSkill;
import com.timebank.repository.ExchangeRequestRepository;
import com.timebank.repository.SessionRepository;
import com.timebank.repository.SkillRepository;
import com.timebank.repository.UserRepository;
import com.timebank.repository.UserSkillRepository;
import com.timebank.repository.WalletRepository;
import com.timebank.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final String DEMO_PASSWORD = "Password123";

    private final UserRepository users;
    private final WalletRepository wallets;
    private final SkillRepository skills;
    private final UserSkillRepository userSkills;
    private final ExchangeRequestRepository requests;
    private final SessionRepository sessions;
    private final WalletService walletService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (users.count() == 0) {
            seedDemoData();
        }
        walletService.grantWelcomeBonusToEligibleWallets();
    }

    private void seedDemoData() {
        User priya = student("Priya Sharma", "priya@timebank.demo", "Delhi University", "avatar-01",
                "Computer science student who loves teaching Java and object-oriented design.");
        User liam = student("Liam Chen", "liam@timebank.demo", "University of Toronto", "avatar-02",
                "Freelance designer helping students build portfolios in Photoshop and Illustrator.");
        User sofia = student("Sofia Martinez", "sofia@timebank.demo", "Universidad de Sevilla", "avatar-03",
                "Native Spanish speaker. Happy to swap conversation practice for coding help.");
        User arjun = student("Arjun Singh", "arjun@timebank.demo", "Punjab University", "avatar-04",
                "Maths tutor for calculus and statistics. Learning to play guitar on weekends.");
        User emma = student("Emma Dubois", "emma@timebank.demo", "Sorbonne University", "avatar-05",
                "Photography hobbyist and native French speaker.");

        offer(priya, "Java", SkillCategory.PROGRAMMING, UserSkill.SkillType.TEACH, "Expert", "OOP, collections and Spring basics");
        offer(priya, "Graphic Design", SkillCategory.GRAPHIC_DESIGN, UserSkill.SkillType.LEARN, "Beginner", null);
        offer(liam, "Graphic Design", SkillCategory.GRAPHIC_DESIGN, UserSkill.SkillType.TEACH, "Advanced", "Layout, typography and branding");
        offer(liam, "Java", SkillCategory.PROGRAMMING, UserSkill.SkillType.LEARN, "Beginner", null);
        offer(liam, "Photography", SkillCategory.PHOTOGRAPHY, UserSkill.SkillType.LEARN, "Beginner", null);
        offer(sofia, "Spanish", SkillCategory.LANGUAGES, UserSkill.SkillType.TEACH, "Expert", "Conversation and grammar");
        offer(sofia, "React Development", SkillCategory.WEB_DEVELOPMENT, UserSkill.SkillType.LEARN, "Beginner", null);
        offer(arjun, "Calculus", SkillCategory.MATHEMATICS, UserSkill.SkillType.TEACH, "Advanced", "Limits, derivatives and integrals");
        offer(arjun, "Guitar", SkillCategory.MUSIC, UserSkill.SkillType.LEARN, "Beginner", null);
        offer(emma, "French", SkillCategory.LANGUAGES, UserSkill.SkillType.TEACH, "Expert", "Everyday French for travellers");
        offer(emma, "Social Media Marketing", SkillCategory.MARKETING, UserSkill.SkillType.LEARN, "Beginner", null);
        offer(emma, "Photography", SkillCategory.PHOTOGRAPHY, UserSkill.SkillType.TEACH, "Intermediate", "Portrait and street photography");

        walletService.credit(priya, 4, "SEED-PRIYA-EARN", "Completed session: Java basics");
        walletService.credit(liam, 3, "SEED-LIAM-EARN", "Completed session: Design critique");
        walletService.credit(sofia, 5, "SEED-SOFIA-EARN", "Completed session: Spanish conversation");
        walletService.credit(arjun, 2, "SEED-ARJUN-EARN", "Completed session: Calculus revision");
        walletService.credit(emma, 1, "SEED-EMMA-EARN", "Completed session: French greetings");

        ExchangeRequest pending = new ExchangeRequest();
        pending.setLearner(liam);
        pending.setTeacher(priya);
        pending.setSkill(skills.findByNameIgnoreCase("Java").orElseThrow());
        pending.setHours(1);
        pending.setMessage("Would love an intro to Java for my next project.");
        requests.save(pending);

        ExchangeRequest accepted = new ExchangeRequest();
        accepted.setLearner(arjun);
        accepted.setTeacher(sofia);
        accepted.setSkill(skills.findByNameIgnoreCase("Spanish").orElseThrow());
        accepted.setHours(1);
        accepted.setStatus(ExchangeRequest.Status.ACCEPTED);
        requests.save(accepted);
        sessions.save(new Session(accepted, LocalDateTime.now().plusDays(2).withHour(18).withMinute(0).withSecond(0).withNano(0), 1));
    }

    private User student(String name, String email, String university, String avatarId, String bio) {
        User user = new User();
        user.setFullName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(DEMO_PASSWORD));
        user.setUniversity(university);
        user.setAvatarId(avatarId);
        user.setBio(bio);
        user = users.save(user);
        wallets.save(new com.timebank.model.Wallet(user));
        return user;
    }

    private void offer(User user, String skillName, SkillCategory category, UserSkill.SkillType type, String level, String details) {
        Skill skill = skills.findByNameIgnoreCase(skillName)
                .orElseGet(() -> skills.save(new Skill(skillName, category, null)));
        userSkills.save(new UserSkill(user, skill, type, level, details));
    }
}
