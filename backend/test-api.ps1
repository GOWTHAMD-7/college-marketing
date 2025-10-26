# Test LeetCode Integration
# This script tests the API endpoints directly

Write-Host "🧪 Testing LeetCode Integration..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$testUser = "student1"
$testLeetCode = "kamyu104"  # A real LeetCode user for testing

# Check if backend is running
Write-Host "1️⃣ Checking if backend is running..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
    Write-Host "   ✅ Backend is running: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend is not running!" -ForegroundColor Red
    Write-Host "   Start the backend first with: .\start-backend.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "2️⃣ Connecting LeetCode account..." -ForegroundColor Yellow
try {
    $connectData = @{
        username = $testUser
        leetcode_url = $testLeetCode
    } | ConvertTo-Json

    $result = Invoke-RestMethod -Uri "$baseUrl/api/leetcode/connect" `
        -Method Post `
        -Body $connectData `
        -ContentType "application/json"
    
    Write-Host "   ✅ Account connected successfully!" -ForegroundColor Green
    Write-Host "   Username: $($result.leetcode_username)" -ForegroundColor White
    Write-Host "   Problems Solved: $($result.total_solved)" -ForegroundColor White
    Write-Host "   Ranking: $($result.ranking)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Failed to connect account" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3️⃣ Fetching profile data..." -ForegroundColor Yellow
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/api/leetcode/profile/$testUser" -Method Get
    Write-Host "   ✅ Profile fetched successfully!" -ForegroundColor Green
    Write-Host "   Easy: $($profile.easy_solved) | Medium: $($profile.medium_solved) | Hard: $($profile.hard_solved)" -ForegroundColor White
    Write-Host "   Current Streak: $($profile.current_streak) days" -ForegroundColor White
    Write-Host "   Last Updated: $($profile.last_updated)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Failed to fetch profile" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4️⃣ Testing manual refresh..." -ForegroundColor Yellow
try {
    $updated = Invoke-RestMethod -Uri "$baseUrl/api/leetcode/update/$testUser" -Method Put
    Write-Host "   ✅ Profile refreshed successfully!" -ForegroundColor Green
    Write-Host "   New Last Updated: $($updated.last_updated)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Failed to refresh profile" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "5️⃣ Testing disconnect..." -ForegroundColor Yellow
try {
    $disconnect = Invoke-RestMethod -Uri "$baseUrl/api/leetcode/disconnect/$testUser" -Method Delete
    Write-Host "   ✅ Account disconnected successfully!" -ForegroundColor Green
    Write-Host "   Message: $($disconnect.message)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Failed to disconnect account" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ API Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start frontend: cd ../frontend; .\start-frontend.ps1" -ForegroundColor White
Write-Host "2. Login with: student1 / student123" -ForegroundColor White
Write-Host "3. Navigate to Social Media page" -ForegroundColor White
Write-Host "4. Connect your LeetCode account" -ForegroundColor White
