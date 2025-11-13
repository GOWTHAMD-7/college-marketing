# Quick Reference Guide - Mock Data System

## ✅ What's Been Done

### 1. Mock Data Population

- **Script**: `backend/populate_mock_data.py`
- **Students**: 2-10 have realistic mock data
- **Student 1**: Reserved for REAL data only (already has real profiles!)
- **Variety**: Different skill levels, platform combinations, and connection states

### 2. Visual Indicators

- **Mock Badge**: Cyan "MOCK DATA" badge appears on demo profiles
- **Tooltip**: Hover shows "This is demo data for demonstration purposes"
- **Real Data**: No badge - clean professional look

### 3. Database Status

Current database has:

- **Student 1**: ✅ Real data (GowthamD27, MukeshR-prog, hari470910209)
- **Student 2**: All platforms - High performer (Mock)
- **Student 3**: LeetCode + GitHub (Mock)
- **Student 4**: GitHub only - Open source (Mock)
- **Student 5**: All platforms - Moderate (Mock)
- **Student 6**: HackerRank only (Mock)
- **Student 7**: LeetCode + HackerRank (Mock)
- **Student 8**: Nothing connected (Realistic scenario)
- **Student 9**: GitHub only - Beginner (Mock)
- **Student 10**: All platforms - Beginner (Mock)

## 🚀 How to Use

### View Current Status

```bash
cd backend
python view_db_status.py
```

### Reset Mock Data

```bash
cd backend
python populate_mock_data.py
```

### Connect Real Profile (As Student)

1. Login as student (e.g., `student2` / password: `student2`)
2. Go to Social Media page
3. Click "Connect Account"
4. Enter real username
5. Data automatically replaces mock data
6. Mock badge disappears

### View Student Achievements (As Teacher)

1. Login as `teacher` / password: `teacher`
2. Click "Student Achievements"
3. Click any student card
4. See performance overview
5. Mock profiles show cyan badge
6. Real profiles (like Student 1) show no badge

## 📊 Testing Scenarios

### Test Case 1: View Mock Data

- Click Student 2 (Alice Johnson)
- Should see "MOCK DATA" badges on all 3 platforms
- High performance stats (387 problems, Level 7, etc.)

### Test Case 2: View Partial Connection

- Click Student 3 (Bob Smith)
- LeetCode + GitHub connected (mock badges)
- HackerRank showing "Not Connected"

### Test Case 3: View Real Data

- Click Student 1
- NO mock badges
- Real scraped data from actual profiles
- Updates automatically every hour

### Test Case 4: No Connections

- Click Student 8
- All platforms "Not Connected"
- Realistic scenario for new students

## 🔧 Technical Details

### Files Modified

1. `frontend/src/pages/StudentAchievements.tsx` - Added mock detection & badges
2. `frontend/src/pages/StudentAchievements.css` - Added badge styling
3. `backend/populate_mock_data.py` - Mock data population script
4. `backend/view_db_status.py` - Database viewer utility

### Mock Usernames List

```typescript
const MOCK_USERNAMES = [
  "alice_coder",
  "bob_algorithm",
  "charlie-opensource",
  "diana_codes",
  "eve_hacker",
  "frank_solver",
  "grace-learning",
  "henry_newbie",
  "alice-codes",
  "bobsmith-dev",
  "diana-dev",
  "henry-codes",
  "alice_j",
  "diana_p",
  "eve_hacker",
  "frank_m",
  "henry_w",
];
```

### How Mock Detection Works

1. Frontend checks platform username against mock list
2. If match found → Display "MOCK DATA" badge
3. If no match → Regular display (real data)
4. When student connects real account → Username changes → Badge disappears

## 🎯 Important Notes

1. **Student 1 = Real Only**: Never populate with mock data
2. **Automatic Updates**: Real data updates hourly via scheduler
3. **Mock Data is Static**: Doesn't update automatically
4. **Seamless Transition**: Real data overwrites mock automatically
5. **Profile Links**: Mock profiles link to example usernames (won't work)
6. **Teacher View**: Can see all students' data including mock indicators

## 🌟 Benefits

✅ **Immediate Demo**: Platform looks populated from day 1
✅ **Realistic Variety**: Different skill levels and scenarios
✅ **Clear Indication**: Teachers know which is demo vs real
✅ **Easy Transition**: Students can connect anytime
✅ **Testing Friendly**: Consistent data for development
✅ **Training Tool**: Teachers can practice with realistic data

## 📝 Next Steps

1. ✅ Restart frontend and backend servers
2. ✅ Login as teacher
3. ✅ Test Student Achievements page
4. ✅ Verify mock badges appear
5. ✅ Test Student 1 (real data, no badge)
6. Login as student2 and connect real profile to test override

## 🐛 Troubleshooting

**Badge not appearing?**

- Check if username is in MOCK_USERNAMES list
- Restart frontend dev server (clear cache)

**Data not showing?**

- Run `python view_db_status.py` to verify database
- Re-run `python populate_mock_data.py` if needed

**Want to reset everything?**

```bash
# Clear all mock data and repopulate
cd backend
python populate_mock_data.py
```

**Want to clear student1 mock (should never have any)?**
Student 1 should only have real data. Current status shows real profiles already connected!

---

**Ready to test!** 🚀 Your platform now has realistic mock data for students 2-10, while Student 1 has real connected profiles. The UI clearly distinguishes between mock and real data with visual badges.
