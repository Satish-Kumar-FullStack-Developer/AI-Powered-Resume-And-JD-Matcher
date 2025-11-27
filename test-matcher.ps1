# Resume & JD Matcher - Quick Test Suite (PowerShell)
# Usage: .\test-matcher.ps1 [resume-file] [jd-file]

param(
    [string]$ResumeFile = "input/resume.pdf",
    [string]$JDFile = "input/jd.pdf"
)

$API_BASE = "http://localhost:5000/api"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Resume & JD Matcher - Quick Test Suite" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Health Check
Write-Host "1️⃣  Backend Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -Method GET -ErrorAction Stop -TimeoutSec 2
    Write-Host "   ✅ Backend is running on port 5000" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend is NOT running. Start it with: npm run dev" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Debug Text Extraction
Write-Host "2️⃣  Testing Text Extraction from Resume..." -ForegroundColor Yellow

if (-not (Test-Path $ResumeFile)) {
    Write-Host "   ❌ Resume file not found: $ResumeFile" -ForegroundColor Red
    exit 1
}

try {
    $form = @{
        resume = Get-Item -Path $ResumeFile
    }
    
    $response = Invoke-WebRequest -Uri "$API_BASE/matching/debug-extract" `
        -Method POST `
        -Form $form `
        -ErrorAction Stop `
        -TimeoutSec 10
    
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.success -and $data.data.textLength -gt 0) {
        Write-Host "   ✅ Text extracted successfully" -ForegroundColor Green
        Write-Host "      - Text length: $($data.data.textLength) characters" -ForegroundColor Green
        Write-Host "      - Keywords found: $($data.data.keywordCount)" -ForegroundColor Green
        Write-Host "      - Sample keywords: $($data.data.keywords[0..4] -join ', ')" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Text extraction failed - no text extracted" -ForegroundColor Red
        Write-Host "   Response: $($data.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Error during text extraction: $($_)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Check Jobs in Database
Write-Host "3️⃣  Checking Jobs in Database..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_BASE/jobs/list" -Method GET -ErrorAction Stop -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    
    $jobCount = $data.data.Count
    
    if ($jobCount -lt 50) {
        Write-Host "   ⚠️  Only $jobCount jobs found (expected 54)" -ForegroundColor Yellow
        Write-Host "   To insert sample jobs, run:" -ForegroundColor Yellow
        Write-Host "   Invoke-WebRequest -Uri 'http://localhost:5000/api/jobs/insert-sample'" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Database has $jobCount jobs" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Could not retrieve job list: $($_)" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Full Matching Test
if (-not (Test-Path $JDFile)) {
    Write-Host "4️⃣  Skipping full matching test - JD file not found: $JDFile" -ForegroundColor Yellow
} else {
    Write-Host "4️⃣  Testing Full Resume-JD Matching..." -ForegroundColor Yellow
    try {
        $form = @{
            resume = Get-Item -Path $ResumeFile
            jobDescription = Get-Item -Path $JDFile
        }
        
        $response = Invoke-WebRequest -Uri "$API_BASE/matching/compare" `
            -Method POST `
            -Form $form `
            -ErrorAction Stop `
            -TimeoutSec 10
        
        $data = $response.Content | ConvertFrom-Json
        
        if ($data.success) {
            $matchPercent = $data.data.matchPercentage
            Write-Host "   ✅ Matching successful - Match: $matchPercent%" -ForegroundColor Green
            Write-Host "      - Matched keywords: $($data.data.matchedKeywords.Count)" -ForegroundColor Green
            Write-Host "      - Missing skills: $($data.data.missingSkills.Count)" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Matching failed: $($data.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Error during matching: $($_)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Test Suite Complete" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If all tests passed, start your frontend: npm start" -ForegroundColor Yellow
Write-Host "2. Upload your resume on the Dashboard" -ForegroundColor Yellow
Write-Host "3. You should see matched job listings with percentages" -ForegroundColor Yellow
