# 🚀 LeetCode Integration - Complete Setup Guide

This guide will help you set up and test the full LeetCode integration with automatic profile scraping and hourly updates.

## ✅ What's Been Implemented

### Backend (Complete)
- ✅ FastAPI REST API with 4 endpoints
- ✅ SQLite database with User and LeetCodeProfile models
- ✅ LeetCode GraphQL scraper module
- ✅ Background scheduler for hourly auto-updates
- ✅ CORS configuration for frontend integration

### Frontend (Complete)
- ✅ Modal for LeetCode URL input
- ✅ Dynamic stats display (problems solved, ranking, streaks)
- ✅ Difficulty breakdown (Easy/Medium/Hard) with colored badges
- ✅ Connect/Disconnect/Refresh functionality
- ✅ Loading states and error handling
- ✅ Last updated timestamp display

## 📦 Step 1: Backend Setup

### Install Dependencies

Open PowerShell and navigate to backend:

```powershell
cd "d:\college marketing new\backend"
```

Install Python packages:

```powershell
pip install fastapi==0.104.1 uvicorn sqlalchemy==2.0.23 apscheduler==3.10.4 requests beautifulsoup4
```

Or use requirements.txt:

```powershell
pip install -r requirements.txt
```

### Start Backend Server

```powershell
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
Scheduler started - will update LeetCode profiles every hour
```

**Keep this terminal open!** The backend must run continuously.

### Verify Backend

Open browser and visit:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/ (should return `{"message": "College Marketing API"}`)

## 📦 Step 2: Frontend Setup

Open a NEW PowerShell window and navigate to frontend:

```powershell
cd "d:\college marketing new\frontend"
```

Install dependencies (if not already done):

```powershell
npm install
```

Start frontend dev server:

```powershell
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

**Keep this terminal open too!**

## 🧪 Step 3: Test the Integration

### 3.1 Login

1. Open http://localhost:5173/
2. You'll see the login page
3. Login with:
   - Username: `student1`
   - Password: `student123`

### 3.2 Navigate to Social Media

1. After login, you'll see the Student Dashboard
2. Click on the **"Social Media"** card
3. You'll see 4 platform cards: LeetCode, GitHub, HackerRank, LinkedIn

### 3.3 Connect LeetCode Account

1. Find the **LeetCode card** (orange icon)
2. Click **"Connect Account"** button
3. A modal will appear asking for LeetCode URL
4. Enter a valid LeetCode profile:
   - **Option 1**: Full URL: `https://leetcode.com/u/username/`
   - **Option 2**: Just username: `username`
   
   **Test with real profiles**:
   - `kamyu104` (Very active user)
   - `lee215` (Contest master)
   - Any public LeetCode username

5. Click **"Connect Account"**
6. Wait for scraping (5-10 seconds)

### 3.4 View Profile Data

Once connected, you'll see:

**Stats Section:**
- 📊 Problems Solved: Total count
- 🏆 Ranking: Global position
- 🔥 Current Streak: Days

**Difficulty Breakdown:**
- 🟢 Easy: Count in green badge
- 🟡 Medium: Count in yellow badge
- 🔴 Hard: Count in red badge

**Action Buttons:**
- 🔄 **Refresh**: Manually update data
- 🔌 **Disconnect**: Remove account

**Last Updated:** Timestamp of last data fetch

### 3.5 Test Manual Refresh

1. Click **"Refresh"** button
2. You'll see "Updating..." state
3. Data will refresh (even if no changes)
4. New timestamp will appear

### 3.6 Test Disconnect

1. Click **"Disconnect"** button
2. Profile data disappears
3. "Connect Account" button reappears
4. Data removed from database

### 3.7 Test Auto-Update (Background Scheduler)

1. Connect a LeetCode account
2. Wait for 1 hour (scheduler runs automatically)
3. Check backend terminal - you'll see:
   ```
   Starting scheduled profile updates...
   Updated profile for student1
   Scheduled update completed
   ```
4. Frontend will show updated data on next page load

## 🔍 Verify Database

After connecting an account:

```powershell
cd "d:\college marketing new\backend"
```

Check if database was created:

```powershell
ls college_marketing.db
```

You can inspect with SQLite browser or Python:

```python
import sqlite3
conn = sqlite3.connect('college_marketing.db')
cursor = conn.cursor()
cursor.execute("SELECT * FROM leetcode_profiles")
print(cursor.fetchall())
```

## 📊 API Testing with cURL

Test endpoints directly:

### Connect Account
```powershell
curl -X POST "http://localhost:8000/api/leetcode/connect" `
  -H "Content-Type: application/json" `
  -d '{"username": "student1", "leetcode_url": "kamyu104"}'
```

### Get Profile
```powershell
curl http://localhost:8000/api/leetcode/profile/student1
```

### Update Profile
```powershell
curl -X PUT http://localhost:8000/api/leetcode/update/student1
```

### Disconnect
```powershell
curl -X DELETE http://localhost:8000/api/leetcode/disconnect/student1
```

## 🎨 Visual Features

### Modal Design
- Glassmorphism overlay with blur
- Smooth animations (fadeIn, slideUp)
- Responsive on mobile
- Close on overlay click or X button

### Stats Display
- Color-coded difficulty badges
- Hover effects on all cards
- Loading spinners during data fetch
- Error messages with red styling

### Buttons
- Navy blue "Connect Account"
- Cyan "Refresh" with loading state
- Red "Disconnect" with hover effect

## 🐛 Common Issues & Solutions

### Issue: CORS Error

**Symptom**: Console shows "CORS policy blocked"

**Solution**: 
- Ensure backend is running on port 8000
- Check `main.py` has CORS middleware
- Frontend should be on port 5173

### Issue: "Profile not found"

**Symptom**: Error message after entering username

**Solutions**:
1. Verify username is correct (case-sensitive)
2. Try full URL format: `https://leetcode.com/u/username/`
3. Ensure profile is public (not private)
4. Try a different user like `kamyu104`

### Issue: Backend not starting

**Symptom**: Import errors or module not found

**Solution**:
```powershell
pip install --upgrade fastapi uvicorn sqlalchemy apscheduler requests beautifulsoup4
```

### Issue: Scheduler not running

**Symptom**: No auto-updates after 1 hour

**Check**:
1. Backend terminal should show: "Scheduler started"
2. Look for scheduler logs after 1 hour
3. Restart backend if needed

### Issue: Modal not appearing

**Symptom**: Click "Connect Account" but nothing happens

**Solution**:
1. Check browser console (F12) for errors
2. Ensure JavaScript is enabled
3. Try hard refresh: Ctrl+Shift+R

## 📈 Expected Behavior Flow

```
User Action → Frontend → Backend → LeetCode API → Database → Frontend Display

1. Click "Connect Account"
   ↓
2. Modal opens
   ↓
3. Enter LeetCode URL
   ↓
4. Frontend sends POST to /api/leetcode/connect
   ↓
5. Backend scraper fetches from LeetCode GraphQL
   ↓
6. Data saved to SQLite database
   ↓
7. Backend returns profile JSON
   ↓
8. Frontend displays stats with animations
   ↓
9. [After 1 hour] Scheduler auto-updates all profiles
   ↓
10. Data refreshed in database
    ↓
11. Frontend shows updated data on next load/refresh
```

## 🎯 Success Criteria

✅ Backend starts without errors
✅ Frontend loads at localhost:5173
✅ Login works with student1/student123
✅ Social Media page displays 4 platform cards
✅ Modal opens when clicking "Connect Account"
✅ Profile data appears after entering username
✅ Stats show: problems solved, ranking, streaks
✅ Difficulty breakdown displays with colors
✅ Manual refresh works
✅ Disconnect removes data
✅ Database file created with profile data
✅ Scheduler logs appear after 1 hour

## 🚀 Next Platform Integration

Once LeetCode is working, you can add:

1. **GitHub** - Repository count, stars, commits
2. **HackerRank** - Badges, stars, certifications
3. **LinkedIn** - Connections, posts, endorsements

Follow the same pattern:
- Create scraper in `backend/scrapers/`
- Add model to `models.py`
- Add endpoints to `main.py`
- Update frontend `SocialMedia.tsx`
- Add styling to `SocialMedia.css`

## 📞 Need Help?

Check these resources:
- **API Documentation**: http://localhost:8000/docs
- **Backend Logs**: Terminal running uvicorn
- **Frontend Logs**: Browser DevTools Console (F12)
- **Database**: `backend/college_marketing.db`

---

**Ready to test?** Follow the steps above and enjoy your automated LeetCode profile integration! 🎉
