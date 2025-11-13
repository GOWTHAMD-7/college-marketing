# Mock Data Information

## Overview

This platform includes realistic **mock data** for students 2-10 to demonstrate the system's capabilities. This allows teachers and administrators to see how the platform works with real-looking data before students connect their actual accounts.

## Mock Data Distribution

| Student    | LeetCode | GitHub | HackerRank | Profile Type                     |
| ---------- | -------- | ------ | ---------- | -------------------------------- |
| Student 1  | ❌       | ❌     | ❌         | **REAL DATA ONLY**               |
| Student 2  | ✅       | ✅     | ✅         | High Performer (Mock)            |
| Student 3  | ✅       | ✅     | ❌         | LeetCode + GitHub (Mock)         |
| Student 4  | ❌       | ✅     | ❌         | GitHub Only - Open Source (Mock) |
| Student 5  | ✅       | ✅     | ✅         | Moderate Performer (Mock)        |
| Student 6  | ❌       | ❌     | ✅         | HackerRank Only (Mock)           |
| Student 7  | ✅       | ❌     | ✅         | LeetCode + HackerRank (Mock)     |
| Student 8  | ❌       | ❌     | ❌         | Not Connected (Realistic)        |
| Student 9  | ❌       | ✅     | ❌         | GitHub Only - Beginner (Mock)    |
| Student 10 | ✅       | ✅     | ✅         | Beginner Level (Mock)            |

## How It Works

### Visual Indicators

- **Mock Data Badge**: Profiles with mock data display a cyan "MOCK DATA" badge
- **Tooltip**: Hover over the badge to see "This is demo data for demonstration purposes"
- **Real Data**: When students connect their actual accounts, the mock data is replaced and the badge disappears

### Mock vs Real Data

1. **Mock Data (Students 2-10)**:

   - Pre-populated demo profiles
   - Visible "MOCK DATA" badge
   - Links to example profiles
   - Used for demonstration only

2. **Real Data (Student 1 & any connected accounts)**:
   - Actual scraped data from LeetCode, GitHub, HackerRank
   - No mock badge
   - Links to real user profiles
   - Updates automatically every hour

### Connecting Real Profiles

When a student connects their real account:

1. Login as the student (e.g., `student2`)
2. Go to **Social Media** page
3. Click **Connect Account** for any platform
4. Enter your actual username
5. The system will:
   - Scrape your real data
   - Replace the mock data
   - Remove the "MOCK DATA" badge
   - Show your actual statistics

## Sample Mock Profiles

### Student 2 - Alice Johnson (High Performer)

- **LeetCode**: 387 problems solved, 1847 contest rating
- **GitHub**: 42 repos, 234 stars, JavaScript/Python/TypeScript
- **HackerRank**: Level 7, 2456.8 total score, 5⭐ Python

### Student 4 - Charlie Brown (Open Source Contributor)

- **GitHub Only**: 67 repos, 567 stars, Go/Rust/Python
- Demonstrates students who focus on open source

### Student 8 - (Not Connected)

- No platforms connected
- Shows realistic scenario of new students

### Student 10 - Henry Wilson (Beginner)

- **LeetCode**: 67 problems (mostly easy)
- **GitHub**: 8 repos, learning projects
- **HackerRank**: Level 3, 456.7 score
- Represents students just starting their coding journey

## Regenerating Mock Data

To repopulate or reset mock data:

```bash
cd backend
python populate_mock_data.py
```

This will:

1. Clear existing mock data for students 2-10
2. Repopulate with fresh mock data
3. Preserve real data for student1 and any connected accounts

## API Endpoints

Mock data uses the same API endpoints as real data:

- `GET /api/leetcode/profile/{username}` - Returns profile (mock or real)
- `GET /api/github/profile/{username}` - Returns profile (mock or real)
- `GET /api/hackerrank/profile/{username}` - Returns profile (mock or real)

## Technical Implementation

### Frontend Detection

```typescript
const MOCK_USERNAMES = [
  "alice_coder",
  "bob_algorithm",
  "charlie-opensource",
  "diana_codes",
  "eve_hacker",
  "frank_solver",
  "grace-learning",
  "henry_newbie", // ... etc
];

const isMockData = (platformUsername: string | undefined) => {
  return platformUsername && MOCK_USERNAMES.includes(platformUsername);
};
```

### Database Structure

Mock data is stored in the same tables as real data:

- `leetcode_profiles`
- `github_profiles`
- `hackerrank_profiles`

The system distinguishes mock from real data by checking the username against the mock username list.

## Benefits

1. **Immediate Demo**: Show the platform's capabilities without waiting for students to connect
2. **Realistic Scenarios**: Different performance levels and connection states
3. **Training**: Teachers can learn the interface with realistic data
4. **Testing**: Developers can test UI with various data combinations
5. **Seamless Transition**: Real data automatically replaces mock data when connected

## Notes

- **Student 1 is ALWAYS reserved for real data** - never populate with mock data
- Mock data does not update automatically (static)
- Real data updates every hour via scheduler
- Mock profiles link to example/non-existent usernames
- Teachers can easily identify mock vs real data via the badge
