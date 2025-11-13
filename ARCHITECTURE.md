# 🏗️ System Architecture - College Marketing Platform

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (Browser - Port 5173)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      FRONTEND LAYER                             │
│                   React 18 + TypeScript                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Login.tsx   │  │  Dashboard   │  │ SocialMedia  │         │
│  │              │  │  .tsx        │  │  .tsx        │         │
│  │ - Auth Form  │  │ - Cards      │  │ - Platforms  │         │
│  │ - Validation │  │ - Navigation │  │ - Modal      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  React Router DOM (Client-side routing)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ fetch() API calls
                            │ http://localhost:8000
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BACKEND LAYER                              │
│                    FastAPI (Port 8000)                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              REST API Endpoints (main.py)               │   │
│  │                                                         │   │
│  │  POST   /api/leetcode/connect       - Connect account  │   │
│  │  GET    /api/leetcode/profile/{u}   - Get profile      │   │
│  │  PUT    /api/leetcode/update/{u}    - Manual refresh   │   │
│  │  DELETE /api/leetcode/disconnect/{u} - Remove account  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            │                                    │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │            Business Logic Layer                       │     │
│  │                                                       │     │
│  │  ┌──────────────────┐    ┌─────────────────────┐    │     │
│  │  │  LeetCode        │    │   Scheduler         │    │     │
│  │  │  Scraper         │    │   (APScheduler)     │    │     │
│  │  │                  │    │                     │    │     │
│  │  │ - GraphQL Query  │    │ - Runs every 1hr    │    │     │
│  │  │ - Extract data   │    │ - Auto-updates      │    │     │
│  │  │ - Parse JSON     │    │ - Background job    │    │     │
│  │  └──────────────────┘    └─────────────────────┘    │     │
│  └───────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            │                                    │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │          Data Access Layer (SQLAlchemy ORM)           │     │
│  │                                                       │     │
│  │  Models:                                              │     │
│  │  - User (id, username, password, role)               │     │
│  │  - LeetCodeProfile (all stats + metadata)            │     │
│  └───────────────────────────────────────────────────────┘     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    DATABASE LAYER                               │
│                SQLite (college_marketing.db)                    │
│                                                                 │
│  ┌──────────────────┐         ┌─────────────────────────┐      │
│  │  users           │         │  leetcode_profiles      │      │
│  │                  │         │                         │      │
│  │ - id (PK)        │         │ - id (PK)               │      │
│  │ - username       │◄────────│ - username (FK)         │      │
│  │ - password       │         │ - leetcode_username     │      │
│  │ - role           │         │ - total_solved          │      │
│  └──────────────────┘         │ - easy/medium/hard      │      │
│                               │ - ranking               │      │
│                               │ - streaks               │      │
│                               │ - contest_data          │      │
│                               │ - full_data (JSON)      │      │
│                               │ - timestamps            │      │
│                               └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ HTTPS GraphQL API
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                    EXTERNAL SERVICE                             │
│                   LeetCode GraphQL API                          │
│             https://leetcode.com/graphql                        │
│                                                                 │
│  Provides:                                                      │
│  - User profile data                                            │
│  - Problem solving statistics                                  │
│  - Contest information                                          │
│  - Ranking data                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Flow Diagram

### User Login Flow

```
┌──────┐     ┌───────────┐     ┌─────────────┐
│ User │────►│ Login.tsx │────►│ Validation  │
└──────┘     └───────────┘     └──────┬──────┘
                                      │
                                      ▼
                              ┌────────────────┐
                              │ Dummy Auth     │
                              │ student1-10    │
                              │ teacher        │
                              └───────┬────────┘
                                      │
                                      ▼
                              ┌────────────────┐
                              │ React Router   │
                              │ Navigate to:   │
                              │ /student or    │
                              │ /teacher       │
                              └────────────────┘
```

### LeetCode Integration Flow

```
┌──────┐
│ User │ Clicks "Connect Account"
└───┬──┘
    │
    ▼
┌──────────────────┐
│ SocialMedia.tsx  │ Opens modal
│ handleConnect    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Modal Component  │ User enters URL
│ Input field      │
└────────┬─────────┘
         │
         │ Click "Connect Account"
         ▼
┌──────────────────┐
│ handleSubmit     │ POST request
│ leetcodeUrl      │
└────────┬─────────┘
         │
         │ fetch('http://localhost:8000/api/leetcode/connect')
         ▼
┌──────────────────────┐
│ FastAPI Backend      │
│ /api/leetcode/connect│
└───────────┬──────────┘
            │
            ▼
┌─────────────────────────┐
│ leetcode_scraper.py     │
│ - extract_username()    │
│ - get_user_profile()    │ ──► GraphQL Query to LeetCode
│ - get_contest_info()    │ ──► GraphQL Query to LeetCode
│ - scrape_profile()      │
└───────────┬─────────────┘
            │
            │ Returns JSON data
            ▼
┌─────────────────────────┐
│ SQLAlchemy ORM          │
│ Create LeetCodeProfile  │
│ object                  │
└───────────┬─────────────┘
            │
            │ INSERT INTO leetcode_profiles
            ▼
┌─────────────────────────┐
│ SQLite Database         │
│ Store profile data      │
└───────────┬─────────────┘
            │
            │ Return saved profile
            ▼
┌─────────────────────────┐
│ FastAPI Response        │
│ JSON with profile data  │
└───────────┬─────────────┘
            │
            │ Response JSON
            ▼
┌─────────────────────────┐
│ SocialMedia.tsx         │
│ setState(leetcodeProfile)│
└───────────┬─────────────┘
            │
            │ Re-render
            ▼
┌─────────────────────────┐
│ UI Updates              │
│ - Show stats            │
│ - Show difficulty       │
│ - Show buttons          │
│ - Hide modal            │
└─────────────────────────┘
```

### Auto-Update Flow (Background Scheduler)

```
┌───────────────────┐
│ FastAPI Startup   │
│ on_event("startup")│
└────────┬──────────┘
         │
         ▼
┌────────────────────┐
│ scheduler.py       │
│ start_scheduler()  │
└────────┬───────────┘
         │
         ▼
┌────────────────────────────┐
│ APScheduler                │
│ BackgroundScheduler        │
│ Interval: 1 hour           │
└────────┬───────────────────┘
         │
         │ Every 1 hour
         ▼
┌────────────────────────────┐
│ update_all_profiles()      │
│ - Query all profiles       │
│ - For each profile:        │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ LeetCode Scraper           │
│ scrape_profile(username)   │
└────────┬───────────────────┘
         │
         │ GraphQL requests
         ▼
┌────────────────────────────┐
│ LeetCode API               │
│ Returns fresh data         │
└────────┬───────────────────┘
         │
         │ Updated data
         ▼
┌────────────────────────────┐
│ SQLAlchemy ORM             │
│ UPDATE leetcode_profiles   │
│ SET ... WHERE username=?   │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Database                   │
│ Profile updated            │
│ last_updated = NOW()       │
└────────────────────────────┘
```

## Technology Stack Details

### Frontend Stack

```
┌─────────────────────────────────────────┐
│         Development Tools               │
│  - Vite (Build tool & dev server)       │
│  - TypeScript (Type safety)             │
│  - ESLint (Code quality)                │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│         Core Framework                  │
│  - React 18 (UI library)                │
│  - React Router DOM v6 (Routing)        │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│         Styling                         │
│  - CSS3 (Custom properties/variables)   │
│  - Flexbox & Grid layouts               │
│  - CSS animations                       │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│         State Management                │
│  - React useState (Local state)         │
│  - React useEffect (Side effects)       │
│  - useLocation (Router state)           │
└─────────────────────────────────────────┘
```

### Backend Stack

```
┌─────────────────────────────────────────┐
│         Web Framework                   │
│  - FastAPI 0.104.1                      │
│  - Uvicorn (ASGI server)                │
│  - Pydantic (Data validation)           │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│         Database Layer                  │
│  - SQLAlchemy 2.0.23 (ORM)             │
│  - SQLite (Database engine)             │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│         Background Jobs                 │
│  - APScheduler 3.10.4                   │
│  - BackgroundScheduler                  │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│         Web Scraping                    │
│  - Requests (HTTP client)               │
│  - BeautifulSoup4 (HTML parsing)        │
│  - JSON/GraphQL handling                │
└─────────────────────────────────────────┘
```

## Data Flow Architecture

### Request-Response Cycle

```
Frontend                Backend              Database           External API
   │                       │                     │                   │
   │  POST /connect        │                     │                   │
   ├──────────────────────►│                     │                   │
   │                       │ Query user exists?  │                   │
   │                       ├────────────────────►│                   │
   │                       │◄────────────────────┤                   │
   │                       │  Scrape profile     │                   │
   │                       ├────────────────────────────────────────►│
   │                       │  GraphQL: userPublicProfile             │
   │                       │◄────────────────────────────────────────┤
   │                       │  Profile JSON                           │
   │                       │                     │                   │
   │                       │  GraphQL: userContestRankingInfo        │
   │                       ├────────────────────────────────────────►│
   │                       │◄────────────────────────────────────────┤
   │                       │  Contest JSON                           │
   │                       │                     │                   │
   │                       │  INSERT profile     │                   │
   │                       ├────────────────────►│                   │
   │                       │◄────────────────────┤                   │
   │                       │  Profile saved      │                   │
   │  Response: 200 OK     │                     │                   │
   │◄──────────────────────┤                     │                   │
   │  JSON: profile data   │                     │                   │
   │                       │                     │                   │
```

## Security Architecture

### Authentication (Current - Dummy)

```
┌──────────┐
│ Frontend │ Validates against hardcoded credentials
└────┬─────┘
     │
     ▼
┌────────────────┐
│ DUMMY_CREDS    │ In-memory validation only
│ - student1-10  │ (No backend auth currently)
│ - teacher      │
└────────────────┘
```

### Future Authentication (Recommended)

```
┌──────────┐
│ Frontend │
└────┬─────┘
     │ POST /login {username, password}
     ▼
┌────────────┐
│  Backend   │
│  FastAPI   │
└────┬───────┘
     │ Hash password & verify
     ▼
┌────────────┐
│  Database  │
│  users     │
└────┬───────┘
     │
     ▼
┌────────────┐
│  JWT Token │ Return to frontend
│  Generated │
└────┬───────┘
     │
     ▼
┌────────────┐
│  Frontend  │ Store in localStorage
│  Headers   │ Send with each request:
└────────────┘ Authorization: Bearer {token}
```

## Deployment Architecture (Production Ready)

### Current (Development)

```
┌──────────────────────────┐
│  Developer Machine       │
│                          │
│  ┌────────────────────┐  │
│  │ Frontend :5173     │  │
│  │ Vite dev server    │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ Backend :8000      │  │
│  │ Uvicorn dev server │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ SQLite Database    │  │
│  │ college_marketing  │  │
│  │ .db                │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### Recommended (Production)

```
┌──────────────────────────┐
│  Frontend Server         │
│  (Nginx/Apache)          │
│  Serves static files     │
│  Port 80/443 (HTTPS)     │
└───────────┬──────────────┘
            │
            │ API Requests
            ▼
┌──────────────────────────┐
│  Reverse Proxy           │
│  (Nginx)                 │
│  Load balancer           │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│  Backend Server          │
│  (Gunicorn/Uvicorn)      │
│  FastAPI app             │
│  Port 8000               │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│  Database Server         │
│  PostgreSQL/MySQL        │
│  (Not SQLite)            │
└──────────────────────────┘
```

## File Structure Tree

```
d:\college marketing new\
│
├── 📄 README.md                          # Project overview
├── 📄 SETUP_GUIDE.md                     # Setup instructions
├── 📄 TESTING_CHECKLIST.md               # Test cases
├── 📄 LEETCODE_INTEGRATION_COMPLETE.md   # Feature summary
├── 📄 ARCHITECTURE.md                    # This file
│
├── 📁 frontend/
│   ├── 📄 package.json                   # NPM dependencies
│   ├── 📄 vite.config.ts                 # Vite configuration
│   ├── 📄 tsconfig.json                  # TypeScript config
│   ├── 📄 start-frontend.ps1             # Quick start script
│   │
│   └── 📁 src/
│       ├── 📄 main.tsx                   # React entry point
│       ├── 📄 App.tsx                    # Root component with routing
│       ├── 📄 index.css                  # Global styles + theme vars
│       │
│       └── 📁 pages/
│           ├── 📄 Login.tsx              # Authentication page
│           ├── 📄 Login.css              # Login styling
│           ├── 📄 StudentDashboard.tsx   # Student home
│           ├── 📄 TeacherDashboard.tsx   # Teacher home
│           ├── 📄 Dashboard.css          # Dashboard styling
│           ├── 📄 SocialMedia.tsx        # Platform integration page
│           └── 📄 SocialMedia.css        # Platform styling + modal
│
└── 📁 backend/
    ├── 📄 requirements.txt               # Python dependencies
    ├── 📄 database.py                    # SQLAlchemy setup
    ├── 📄 models.py                      # Database models
    ├── 📄 main.py                        # FastAPI application
    ├── 📄 scheduler.py                   # Background jobs
    ├── 📄 start-backend.ps1              # Quick start script
    ├── 📄 test-api.ps1                   # API test script
    │
    ├── 📁 scrapers/
    │   └── 📄 leetcode_scraper.py        # LeetCode GraphQL scraper
    │
    └── 📄 college_marketing.db           # SQLite database (auto-generated)
```

## API Endpoint Architecture

```
FastAPI Application (main.py)
│
├── Middleware
│   └── CORSMiddleware (Allow frontend access)
│
├── Startup Events
│   └── start_scheduler() - Initialize background jobs
│
├── Root Endpoint
│   └── GET /
│       └── Returns: {"message": "College Marketing API"}
│
└── LeetCode Endpoints (/api/leetcode/)
    │
    ├── POST /connect
    │   ├── Input: ConnectRequest {username, leetcode_url}
    │   ├── Process:
    │   │   1. Extract LeetCode username
    │   │   2. Call scraper.scrape_profile()
    │   │   3. Create/Update database record
    │   └── Output: LeetCodeProfileResponse (all fields)
    │
    ├── GET /profile/{username}
    │   ├── Input: username (path parameter)
    │   ├── Process:
    │   │   1. Query database for existing profile
    │   │   2. Return if found, 404 if not
    │   └── Output: LeetCodeProfileResponse
    │
    ├── PUT /update/{username}
    │   ├── Input: username (path parameter)
    │   ├── Process:
    │   │   1. Fetch existing profile from DB
    │   │   2. Scrape fresh data from LeetCode
    │   │   3. Update database record
    │   │   4. Update last_updated timestamp
    │   └── Output: LeetCodeProfileResponse (updated)
    │
    └── DELETE /disconnect/{username}
        ├── Input: username (path parameter)
        ├── Process:
        │   1. Query database for profile
        │   2. Delete profile record
        │   3. Commit transaction
        └── Output: {"message": "LeetCode profile disconnected"}
```

## Scheduler Architecture

```
APScheduler Background Scheduler
│
├── Configuration
│   ├── Type: BackgroundScheduler
│   ├── Interval: 1 hour (3600 seconds)
│   └── Start: On FastAPI startup
│
├── Job Function: update_all_profiles()
│   │
│   ├── 1. Get database session
│   │
│   ├── 2. Query all LeetCodeProfile records
│   │   └── SELECT * FROM leetcode_profiles
│   │
│   ├── 3. For each profile:
│   │   ├── Extract leetcode_username
│   │   ├── Call scraper.scrape_profile()
│   │   ├── Update fields if scrape successful
│   │   ├── Update last_updated timestamp
│   │   └── Commit changes
│   │
│   ├── 4. Log results
│   │   ├── "Updated profile for {username}"
│   │   └── "Scheduled update completed"
│   │
│   └── 5. Close database session
│
└── Error Handling
    ├── Catch scraping failures (network, rate limit)
    ├── Catch database errors
    └── Continue processing remaining profiles
```

## State Management (Frontend)

```
SocialMedia.tsx Component State
│
├── showLeetCodeModal: boolean
│   └── Controls modal visibility
│
├── leetcodeUrl: string
│   └── User input for LeetCode URL/username
│
├── isLoading: boolean
│   └── Shows loading state during API calls
│
├── error: string | null
│   └── Displays error messages
│
├── leetcodeProfile: LeetCodeProfile | null
│   └── Stores fetched profile data
│
└── isLoadingProfile: boolean
    └── Loading state during initial fetch

State Transitions:
┌─────────────────┐
│ Initial State   │
│ - modal: false  │
│ - profile: null │
└────────┬────────┘
         │
         │ User clicks "Connect"
         ▼
┌─────────────────┐
│ Modal Open      │
│ - modal: true   │
│ - url: ""       │
└────────┬────────┘
         │
         │ User enters URL & submits
         ▼
┌─────────────────┐
│ Loading State   │
│ - loading: true │
│ - error: null   │
└────────┬────────┘
         │
         │ API returns success
         ▼
┌─────────────────┐
│ Connected State │
│ - modal: false  │
│ - profile: {...}│
│ - loading: false│
└─────────────────┘
```

## Error Handling Strategy

```
Frontend Error Handling
│
├── Network Errors
│   ├── Catch: fetch() rejection
│   ├── Display: "Unable to connect to server"
│   └── Action: Show error message, keep modal open
│
├── Validation Errors
│   ├── Catch: Empty input, invalid URL
│   ├── Display: Inline validation message
│   └── Action: Disable submit button
│
├── API Errors (4xx)
│   ├── 404: Profile not found
│   ├── 400: Invalid request
│   └── Action: Display error.message from backend
│
└── Server Errors (5xx)
    ├── 500: Internal server error
    └── Action: "Server error, please try again"

Backend Error Handling
│
├── Scraping Errors
│   ├── Profile not found → 404 HTTPException
│   ├── Network timeout → 500 HTTPException
│   └── Rate limit → 429 HTTPException (recommended)
│
├── Database Errors
│   ├── Duplicate username → Handle gracefully (update)
│   ├── Connection error → 500 HTTPException
│   └── Transaction rollback on error
│
└── Validation Errors
    ├── Missing fields → 422 Unprocessable Entity
    └── Invalid data types → Pydantic validation
```

---

## Performance Considerations

### Frontend Optimization

- React component memoization opportunities
- CSS animations use transform (GPU accelerated)
- Lazy loading for additional platforms
- Debounce user input in modal

### Backend Optimization

- Database connection pooling (SQLAlchemy)
- Rate limiting for external API calls
- Caching layer (Redis) for frequent queries
- Async/await for concurrent scraping (future)

### Database Optimization

- Indexes on username columns
- Foreign key constraints for data integrity
- Consider PostgreSQL for production (better concurrency)
- Regular VACUUM for SQLite maintenance

---

**This architecture supports:**
✅ Scalable multi-platform integration
✅ Background job processing
✅ Clean separation of concerns
✅ Easy testing and maintenance
✅ Future feature additions

---

_Architecture designed for the College Marketing & Branding Platform_
_LeetCode Integration - Version 1.0_
