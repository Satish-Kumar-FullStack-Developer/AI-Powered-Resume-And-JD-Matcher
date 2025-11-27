#!/bin/bash
# Simple test script for Resume & JD Matcher

API_BASE="http://localhost:5000/api"
RESUME_FILE="${1:-input/resume.pdf}"
JD_FILE="${2:-input/jd.pdf}"

echo "========================================="
echo "Resume & JD Matcher - Quick Test Suite"
echo "========================================="
echo ""

# Test 1: Backend Health Check
echo "1️⃣  Backend Health Check..."
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 5000"
else
    echo "   ❌ Backend is NOT running. Start it with: npm run dev"
    exit 1
fi

echo ""

# Test 2: Debug Text Extraction
echo "2️⃣  Testing Text Extraction from Resume..."
if [ ! -f "$RESUME_FILE" ]; then
    echo "   ❌ Resume file not found: $RESUME_FILE"
    exit 1
fi

EXTRACT_RESPONSE=$(curl -s -X POST "$API_BASE/matching/debug-extract" \
    -F "resume=@$RESUME_FILE")

TEXT_LENGTH=$(echo "$EXTRACT_RESPONSE" | grep -o '"textLength":[0-9]*' | cut -d: -f2)
KEYWORD_COUNT=$(echo "$EXTRACT_RESPONSE" | grep -o '"keywordCount":[0-9]*' | cut -d: -f2)

if [ -z "$TEXT_LENGTH" ] || [ "$TEXT_LENGTH" = "0" ]; then
    echo "   ❌ Text extraction failed - no text extracted"
    echo "   Response: $EXTRACT_RESPONSE"
    exit 1
else
    echo "   ✅ Text extracted successfully"
    echo "      - Text length: $TEXT_LENGTH characters"
    echo "      - Keywords found: $KEYWORD_COUNT"
fi

echo ""

# Test 3: Check Jobs in Database
echo "3️⃣  Checking Jobs in Database..."
JOBS_RESPONSE=$(curl -s -X GET "$API_BASE/jobs/list")
JOB_COUNT=$(echo "$JOBS_RESPONSE" | grep -o '"_id"' | wc -l)

if [ "$JOB_COUNT" -lt 50 ]; then
    echo "   ⚠️  Only $JOB_COUNT jobs found (expected 54)"
    echo "   Run the insert sample jobs endpoint:"
    echo "   curl http://localhost:5000/api/jobs/insert-sample"
else
    echo "   ✅ Database has $JOB_COUNT jobs"
fi

echo ""

# Test 4: Full Matching Test
if [ ! -f "$JD_FILE" ]; then
    echo "4️⃣  Skipping full matching test - JD file not found: $JD_FILE"
else
    echo "4️⃣  Testing Full Resume-JD Matching..."
    MATCH_RESPONSE=$(curl -s -X POST "$API_BASE/matching/compare" \
        -F "resume=@$RESUME_FILE" \
        -F "jobDescription=@$JD_FILE")
    
    MATCH_PERCENT=$(echo "$MATCH_RESPONSE" | grep -o '"matchPercentage":[0-9]*' | cut -d: -f2)
    
    if [ -z "$MATCH_PERCENT" ]; then
        echo "   ❌ Matching failed"
        echo "   Response: $MATCH_RESPONSE"
    else
        echo "   ✅ Matching successful - Match: $MATCH_PERCENT%"
    fi
fi

echo ""
echo "========================================="
echo "✅ Test Suite Complete"
echo "========================================="
