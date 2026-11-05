# TimeBank

TimeBank is a student skill-exchange platform. Students teach what they know and learn what they need, paying and earning time credits: one credit per hour taught, one credit per hour learned.

- `src/` - React frontend (Vite, Tailwind CSS)
- `backend/` - Java 17 + Spring Boot REST API with an H2 database

## One-time setup (Windows 11)

1. **Install Java 17.** Download the Temurin 17 (LTS) Windows installer from https://adoptium.net. In the installer, turn on "Set JAVA_HOME variable" and "Add to PATH".
2. **Install Node.js (LTS)** from https://nodejs.org.
3. Open **PowerShell** and go to the project folder (the one that contains `package.json`):

   ```powershell
   cd path\to\TimeBank
   ```

You do not need to install Maven. The included Maven Wrapper downloads it automatically the first time.

## Start the backend

Open a PowerShell window in the project folder and run:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The first run downloads dependencies and can take a few minutes. Wait for a line that says `Started TimeBankApplication`. Leave this window open. The API runs at `http://localhost:8080/api`.

## Start the frontend

Open a second PowerShell window in the project folder and run:

```powershell
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser. Leave this window open too.

## Demo accounts

The database is an in-memory H2 database. It starts with sample students, skills, exchange requests and credits each time the backend starts. Restarting the backend resets the data, and any accounts you registered are removed.

All demo accounts use the password `Password123`:

- priya@timebank.demo (Java teacher, 4 credits)
- liam@timebank.demo (design teacher, 3 credits)
- sofia@timebank.demo (Spanish teacher, 5 credits)
- arjun@timebank.demo (calculus teacher, 2 credits)
- emma@timebank.demo (French and photography teacher, 1 credit)

You can also create your own account from the sign-up page.

The H2 database console is at `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:timebank`, user `sa`, no password).

## Troubleshooting

- **"Cannot reach the TimeBank server"** on the website: the backend window is closed or still starting. Start it and refresh the page.
- **"Port 8080 was already in use"**: another program uses port 8080. Close it and start the backend again.
- **`'java' is not recognized`**: Java 17 is not installed or was not added to PATH. Reinstall Temurin 17 with the PATH option turned on, then open a new PowerShell window.
- **Scripts are blocked in PowerShell**: `.\mvnw.cmd` and `npm` run without changing settings. If PowerShell still blocks `npm`, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once.
