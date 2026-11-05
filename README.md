# ⏳ TimeBank – Student Skill Exchange Platform

### Exchange Skills. Share Knowledge. Grow Together.

## 1. Project Overview

TimeBank is a student-oriented skill exchange platform developed using Java and modern web technologies.

The main idea behind TimeBank is simple: students can teach their skills to other students and, in return, learn something new without necessarily exchanging money.

Instead of paying for learning sessions, users exchange their time and knowledge through a credit-based system.

For example:
- A student who knows Java can teach another student.
- In exchange, that student can learn graphic designing.
- Both students benefit by sharing their knowledge and time.

TimeBank encourages collaborative learning, peer-to-peer education and skill development.

## 2. Problem Statement

Many students possess valuable skills but lack opportunities to share them or learn from others.

Traditional learning platforms often require monetary payments, subscriptions or paid courses.

There is a need for a student-friendly platform where learners can exchange knowledge, connect with peers and develop practical skills without depending entirely on money.

TimeBank aims to address this problem through a time-based skill exchange system.

## 3. Project Objectives

- Create a platform for peer-to-peer skill exchange.
- Encourage collaborative learning among students.
- Allow students to list the skills they can teach.
- Help students discover people who can teach the skills they want to learn.
- Introduce a credit-based exchange mechanism.
- Provide a structured process for requesting, accepting and scheduling learning sessions.
- Build a user-friendly and interactive interface.

## 4. Key Features

### User Authentication
Users can register and log in to their accounts.

### User Profiles and Avatars
Users can personalize their profiles using different avatar options.

### Skill Management
Students can add and manage the skills they are willing to teach.

### Skill Matching
Users can explore available skills and find potential learning partners.

### Exchange Requests
Users can send requests to other students for skill exchange sessions.

### Request Management
Users can view incoming requests and accept or reject them.

### Credit-Based Wallet
The platform uses time credits to manage skill exchanges.

New accounts receive 10 welcome credits.

### Session Scheduling
Once an exchange request is accepted, users can arrange a suitable time for their learning session.

### Ratings and Reviews
Users can rate and review completed exchanges.

### Notifications
Users can view notifications related to their activities.

## 5. How TimeBank Works

The platform follows a simple workflow:

1. A student registers or logs into TimeBank.
2. The student creates a profile.
3. The student adds skills they can teach.
4. Other students explore available skills.
5. A student sends an exchange request.
6. The receiving student reviews and accepts or rejects the request.
7. Once accepted, both students can coordinate a session.
8. They conduct their learning session.
9. The exchange can be completed and rated.

The platform provides the infrastructure for arranging learning exchanges.

## 6. Technologies Used

### Backend
- Java 17
- Spring Boot
- Spring MVC
- Maven
- REST APIs

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- HTML
- CSS

### Development Tools
- IntelliJ IDEA / VS Code
- Git
- GitHub
- GitHub Desktop
- Node.js
- Maven Wrapper

## 7. Project Architecture

TimeBank follows a frontend-backend architecture.

**Frontend:**
The React application provides the user interface and allows students to interact with the platform.

**Backend:**
The Java Spring Boot application handles application logic, user operations, skill exchanges, wallet operations and API requests.

**Communication:**
The frontend communicates with the backend through REST API endpoints.

## 8. Project Structure

```text
TimeBank/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Maven Wrapper
│
├── src/
│   ├── components/
│   ├── pages/
│   └── types.ts
│
├── .bolt/
├── package.json
├── package-lock.json
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── eslint.config.js
└── README.md
```

## 9. Installation and Setup

### Prerequisites

Install the following:

- Java Development Kit 17
- Node.js LTS
- npm

### Step 1: Clone the Repository

```bash
git clone https://github.com/Pragati81288/TimeBank.git
```

### Step 2: Open the Project

```bash
cd TimeBank
```

### Step 3: Start the Backend

Open a terminal:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Wait until the application starts successfully.

The backend runs on:

```text
http://localhost:8080
```

### Step 4: Start the Frontend

Open a second terminal in the main TimeBank project folder.

Run:

```bash
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the frontend address in your browser.

Keep both terminal windows running while using the application.

## 10. Future Scope

The project can be extended with the following features:

- Integrated video calling for online teaching sessions.
- Real-time chat between students.
- Live notifications.
- Calendar integration for scheduling.
- Improved skill recommendation and matching.
- Additional learning resources.
- Mobile application support.

## 11. Project Outcomes

TimeBank demonstrates how Java-based backend development can be integrated with a modern frontend to create a practical web application.

The project provides experience in:

- Object-oriented programming.
- Java backend development.
- Spring Boot application development.
- REST API integration.
- Frontend-backend communication.
- User authentication.
- Database-oriented application development.
- Git and GitHub version control.

## 12. Conclusion

TimeBank aims to make learning more collaborative by allowing students to exchange their knowledge and skills.

By combining Java, Spring Boot and modern frontend technologies, the project provides a platform where students can connect, learn and grow together.

**Developed as an academic Java project.**

GitHub Repository:

https://github.com/Pragati81288/TimeBank
