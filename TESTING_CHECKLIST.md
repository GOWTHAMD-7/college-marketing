# ✅ LeetCode Integration Testing Checklist

## Pre-Testing Setup

- [ ] Node.js installed (v16+)
- [ ] Python installed (3.8+)
- [ ] Both terminals ready (one for backend, one for frontend)

## Backend Testing

### Installation
- [ ] Navigate to: `cd "d:\college marketing new\backend"`
- [ ] Run: `.\start-backend.ps1` OR `pip install -r requirements.txt; uvicorn main:app --reload --port 8000`
- [ ] Backend starts without errors
- [ ] Console shows: "Scheduler started - will update LeetCode profiles every hour"
- [ ] Visit http://localhost:8000/docs - Swagger UI loads
- [ ] Visit http://localhost:8000/ - Returns `{"message": "College Marketing API"}`

### API Endpoint Testing
- [ ] Run: `.\test-api.ps1` (or test manually with cURL/Postman)
- [ ] ✅ POST /api/leetcode/connect - Returns profile data
- [ ] ✅ GET /api/leetcode/profile/{username} - Returns existing profile
- [ ] ✅ PUT /api/leetcode/update/{username} - Updates and returns profile
- [ ] ✅ DELETE /api/leetcode/disconnect/{username} - Returns success message

### Database Verification
- [ ] File `college_marketing.db` created in backend folder
- [ ] Contains `users` and `leetcode_profiles` tables
- [ ] Profile data stored correctly after connect

## Frontend Testing

### Installation
- [ ] Navigate to: `cd "d:\college marketing new\frontend"`
- [ ] Run: `.\start-frontend.ps1` OR `npm install; npm run dev`
- [ ] Frontend starts without errors
- [ ] Visit http://localhost:5173 - Login page loads
- [ ] No console errors in browser DevTools (F12)

### Login Flow
- [ ] Enter username: `student1`
- [ ] Enter password: `student123`
- [ ] Click "Login" button
- [ ] Redirects to Student Dashboard
- [ ] Dashboard shows "Welcome, student1!"
- [ ] Repeat for student2-10 and teacher account

### Navigation
- [ ] Dashboard displays 4-5 feature cards
- [ ] "Social Media" card is visible
- [ ] Click "Social Media" card
- [ ] Redirects to /social-media page
- [ ] Header shows "Social Media Platforms"
- [ ] "Back to Dashboard" button works

### Social Media Page UI
- [ ] Page displays 4 platform cards:
  - [ ] LeetCode (Orange icon)
  - [ ] GitHub (Black icon)
  - [ ] HackerRank (Green icon)
  - [ ] LinkedIn (Blue icon)
- [ ] Each card has:
  - [ ] Platform icon
  - [ ] Platform name
  - [ ] Description text
  - [ ] Stats section (shows "-" for unconnected)
  - [ ] "Connect Account" button

## LeetCode Integration Testing

### Connect Account - Happy Path
- [ ] Click "Connect Account" on LeetCode card
- [ ] Modal appears with smooth animation
- [ ] Modal has:
  - [ ] Title: "Connect LeetCode Account"
  - [ ] Description text
  - [ ] Input field for URL/username
  - [ ] "Cancel" button
  - [ ] "Connect Account" button (disabled when empty)
  - [ ] X button in top-right

### Test with Real LeetCode User
- [ ] Enter username: `kamyu104` (or any public LeetCode user)
- [ ] Click "Connect Account"
- [ ] Button shows "Connecting..." with disabled state
- [ ] Modal closes after success
- [ ] Card updates with real data:

**Stats Section:**
- [ ] Problems Solved: Shows actual number (not "-")
- [ ] Ranking: Shows actual ranking (formatted with commas)
- [ ] Current Streak: Shows streak count

**Difficulty Breakdown:**
- [ ] Easy: Shows count in green badge
- [ ] Medium: Shows count in yellow badge  
- [ ] Hard: Shows count in red badge
- [ ] Badges have hover effect

**Connected Actions:**
- [ ] "Refresh" button appears (cyan color)
- [ ] "Disconnect" button appears (red border)
- [ ] "Connect Account" button is hidden

**Footer:**
- [ ] "Last updated: [timestamp]" appears
- [ ] Timestamp is properly formatted

### Modal Functionality
- [ ] Click "Cancel" - Modal closes without connecting
- [ ] Click overlay (outside modal) - Modal closes
- [ ] Click X button - Modal closes
- [ ] Press ESC key - Modal should close (verify behavior)
- [ ] Input field accepts full URL: `https://leetcode.com/u/username/`
- [ ] Input field accepts just username: `username`

### Error Handling
- [ ] Enter invalid username: `nonexistent_user_12345`
- [ ] Click "Connect Account"
- [ ] Error message appears in red: "Failed to scrape profile..."
- [ ] Modal stays open
- [ ] Can retry with correct username

### Manual Refresh
- [ ] With connected account, click "Refresh" button
- [ ] Button shows "Updating..." with disabled state
- [ ] Button has refresh icon animation (optional)
- [ ] Data updates (timestamp changes)
- [ ] Button returns to "Refresh" state
- [ ] No errors in console

### Disconnect Account
- [ ] Click "Disconnect" button
- [ ] (Optional: Add confirmation dialog)
- [ ] Profile data disappears
- [ ] Stats return to "-"
- [ ] "Connect Account" button reappears
- [ ] "Refresh" and "Disconnect" buttons hidden
- [ ] No errors in console

### Persistence Testing
- [ ] Connect LeetCode account as student1
- [ ] Verify data displays
- [ ] Refresh browser (F5)
- [ ] Login again as student1
- [ ] Navigate to Social Media page
- [ ] Profile data still displayed (fetched from database)
- [ ] Timestamp matches previous connection

### Multi-User Testing
- [ ] Login as student1, connect LeetCode profile A
- [ ] Logout, login as student2, connect LeetCode profile B
- [ ] Verify each student sees only their profile
- [ ] Logout, login back as student1
- [ ] Verify student1 still sees profile A (not B)

### Auto-Update Testing (Background Scheduler)
- [ ] Connect a LeetCode account
- [ ] Note the "Last updated" timestamp
- [ ] Wait 1 hour (or temporarily change scheduler.py to 1 minute for testing)
- [ ] Check backend console for scheduler logs:
  ```
  Starting scheduled profile updates...
  Updated profile for student1
  Scheduled update completed
  ```
- [ ] Refresh frontend page
- [ ] Verify "Last updated" timestamp changed
- [ ] Verify stats are updated if LeetCode profile changed

## Visual & UX Testing

### Responsive Design
- [ ] Resize browser to mobile width (375px)
- [ ] Modal is responsive (95% width on mobile)
- [ ] Platform cards stack vertically
- [ ] Buttons full-width on mobile
- [ ] Stats section wraps properly
- [ ] Difficulty badges stack on mobile

### Animations & Hover Effects
- [ ] Platform cards have hover effect (lift up, shadow, border)
- [ ] Platform icons rotate slightly on hover
- [ ] Buttons have hover effects (color change, shadow)
- [ ] Modal has fadeIn animation
- [ ] Modal content has slideUp animation
- [ ] Difficulty badges have hover effect

### Loading States
- [ ] "Loading..." shows when fetching existing profile on mount
- [ ] "Connecting..." shows during account connection
- [ ] "Updating..." shows during manual refresh
- [ ] All buttons disable during loading
- [ ] Input field disables during loading

### Error States
- [ ] Error message styled with red background and border
- [ ] Error message is readable and helpful
- [ ] Error doesn't break page layout
- [ ] Can dismiss error and retry

## Browser Compatibility
- [ ] Chrome/Edge - All features work
- [ ] Firefox - All features work
- [ ] Safari (if available) - All features work
- [ ] Mobile browsers - All features work

## Performance Testing
- [ ] Profile fetch completes in < 10 seconds
- [ ] Page doesn't freeze during scraping
- [ ] No memory leaks (check DevTools Performance)
- [ ] Smooth animations (60fps)

## Database Integrity
- [ ] After multiple connect/disconnect cycles
- [ ] No duplicate entries in database
- [ ] Orphaned records are cleaned up
- [ ] Timestamps are accurate

## Edge Cases
- [ ] Try connecting same LeetCode account to different students
- [ ] Try connecting when backend is down (should show error)
- [ ] Try very long usernames (UI doesn't break)
- [ ] Try special characters in username
- [ ] Try empty string (button should be disabled)
- [ ] Try whitespace-only string (should handle gracefully)

## Final Integration Test
- [ ] Fresh browser (clear cache/cookies)
- [ ] Start backend with `.\start-backend.ps1`
- [ ] Start frontend with `.\start-frontend.ps1`
- [ ] Login as student1
- [ ] Navigate to Social Media
- [ ] Connect LeetCode account (use real username)
- [ ] Verify all data displays correctly
- [ ] Manual refresh works
- [ ] Disconnect works
- [ ] Reconnect works
- [ ] Logout, login as student2
- [ ] Connect different LeetCode account
- [ ] Verify isolation between users
- [ ] Close browsers and terminals
- [ ] Restart everything
- [ ] Verify data persisted (still in database)

## Documentation
- [ ] README.md is up-to-date
- [ ] SETUP_GUIDE.md is accurate
- [ ] All code is commented
- [ ] API endpoints documented
- [ ] Environment variables documented (if any)

## Optional Enhancements (Future)
- [ ] Add loading skeleton instead of "Loading..."
- [ ] Add confirmation dialog for disconnect
- [ ] Add profile preview before connecting
- [ ] Add batch import (connect multiple platforms at once)
- [ ] Add export functionality (download profile as JSON/PDF)
- [ ] Add charts/graphs for problem-solving trends
- [ ] Add comparison between students (for teachers)

---

## Test Results Summary

**Date:** _______________
**Tester:** _______________

**Backend Tests:** _____ / _____ passed
**Frontend Tests:** _____ / _____ passed
**Integration Tests:** _____ / _____ passed

**Critical Issues Found:** _______________
**Notes:** _______________

---

**Status:** ⬜ Not Started | 🔄 In Progress | ✅ Complete | ❌ Failed
