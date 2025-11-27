# Resume & JD Matcher - Testing & Debugging Guide

## 🔧 Recent Changes

### 1. **Fixed Authentication Issue**
   - **Problem**: The `/api/matching/compare` endpoint required authentication that wasn't being provided
   - **Solution**: Made the endpoint public (no auth required) to allow unregistered users to test matching
   - **File**: `backend/src/routes/matchingRoutes.ts`

### 2. **Improved PDF Text Extraction**
   - **Changes**:
     - Added better error handling for page-by-page extraction
     - Added validation to ensure text was actually extracted
     - Added detailed logging for debugging
   - **File**: `backend/src/utils/textProcessingUtils.ts`

### 3. **Added Debug Endpoint**
   - **Endpoint**: `POST /api/matching/debug-extract`
   - **Purpose**: Test if your resume PDF is being read correctly
   - **No authentication required**
   - **File**: `backend/src/controllers/matchingController.ts` and `backend/src/routes/matchingRoutes.ts`

### 4. **Fixed Field Name**
   - Changed field name from `jd` to `jobDescription` in upload middleware for consistency
   - Ensures both frontend and backend use the same field name

### 5. **Enhanced Matching Algorithm**
   - Multi-factor scoring with 3 components:
     - **Keyword Ratio** (40%): How many JD keywords appear in resume
     - **Similarity Score** (40%): Jaccard similarity of entire texts
     - **Technical Terms** (20%): Specific tech stack keyword matching
   - Better detection of technical skills (React, Node.js, TypeScript, etc.)
   - **File**: `backend/src/services/matchingService.ts`

---

## 🧪 Testing Steps

### Step 1: Ensure Backend is Running

```bash
cd "backend"
npm install  # if needed
npm run dev
```

You should see:
```
Server running on http://localhost:5000
```

### Step 2: Test PDF Text Extraction (Debug Endpoint)

Use **Postman** or **curl** to test:

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/matching/debug-extract \
  -F "resume=@input/resume.pdf"
```

**Using Postman:**
1. Create a POST request to: `http://localhost:5000/api/matching/debug-extract`
2. Go to "Body" tab → Select "form-data"
3. Add key: `resume` (type: File) → Upload your `resume.pdf`
4. Send

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "textLength": 2500,
    "keywordCount": 145,
    "keywords": ["react", "javascript", "typescript", "node", ...],
    "extractedText": "Senior Full Stack Developer with 5+ years..."
  },
  "message": "Debug extraction successful"
}
```

**What to Check:**
- ✅ `textLength` should be > 500 (indicates text was extracted)
- ✅ `keywordCount` should be > 50 (indicates good keyword extraction)
- ✅ `keywords` should include your technical skills (react, node, etc.)
- ✅ `extractedText` should show actual resume content

### Step 3: Insert Sample Jobs

Make a GET request to:
```
http://localhost:5000/api/jobs/insert-sample
```

Or in the frontend, click the "Insert Sample Jobs" button on the Dashboard (if visible).

**Expected**: Response indicating 54 jobs were inserted.

### Step 4: Test Full Matching Pipeline

**Option A: Using Frontend Dashboard**

1. Start the frontend:
```bash
cd "frontend"
npm start
```

2. On the Dashboard page:
   - Click "Upload Resume"
   - Select your `resume.pdf`
   - Wait for matches to calculate
   - Should see jobs listed with match percentages (in green if >70%, red if <70%)

**Option B: Using Postman/curl**

```bash
curl -X POST http://localhost:5000/api/matching/compare \
  -F "resume=@input/resume.pdf" \
  -F "jobDescription=@input/jd.pdf"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "matchPercentage": 85,
    "matchedKeywords": ["react", "typescript", "node", ...],
    "missingSkills": ["kubernetes", "aws", ...],
    "suggestions": ["✓ Good match!", ...]
  },
  "message": "Comparison completed successfully"
}
```

---

## 📊 Expected Results

### For Your Resume (5+ Years Full Stack Developer)

If your resume contains: React, Node.js, TypeScript, MongoDB, PostgreSQL, Docker, AWS, Express

You should get approximately:
- **100% match** for: "Senior Full Stack Developer", "Senior Full Stack Engineer"
- **95%+ match** for: "Senior React Developer", "Senior Node.js Developer"
- **85-90% match** for: "Full Stack Engineer", "React Developer with Backend"
- **70-75% match** for: "Senior Software Engineer", "Full Stack Developer"
- **50-60% match** for: "Full Stack Developer", "Backend Developer (Node.js)"
- **20-30% match** for: "Solutions Architect", "DevOps Engineer"

### If You're Getting 0% Matches

**Likely Causes:**

1. ❌ **PDF not being read** → Test with debug endpoint first
2. ❌ **Wrong field names in upload** → Check that both are using `resume` and `jobDescription`
3. ❌ **MongoDB not running** → Ensure MongoDB service is running
4. ❌ **Text extraction failing silently** → Check backend console logs
5. ❌ **No jobs in database** → Run the insert-sample endpoint

---

## 🔍 Debugging Checklist

### Backend Console Logs to Look For

After uploading a resume and matching, check your backend terminal for:

```
[INFO] Extracted resume text length: 2500
[INFO] Resume keywords count: 145
[INFO] Matched keywords: 32
[INFO] Missing skills: 18
[INFO] Match calculation: {
  keywordRatio: 72.22,
  similarityPercent: 65.50,
  technicalScore: 80.00,
  finalPercentage: 71
}
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "No text extracted" | PDF corrupted or unsupported | Try a different PDF or use .txt format |
| 0% match | Text extraction returned 0 length | Check debug endpoint output |
| Endless loading | API endpoint timing out | Check if backend is running |
| 401 Unauthorized | Auth issues (now should be fixed) | Verify you're using the updated routes |
| Field name errors | Mismatch between frontend/backend | Frontend sends `jobDescription`, backend expects `jobDescription` |

---

## 📝 Files Modified

1. **`backend/src/routes/matchingRoutes.ts`**
   - Removed auth requirement from `/compare` endpoint
   - Added debug endpoint `/debug-extract`

2. **`backend/src/controllers/matchingController.ts`**
   - Added `debugExtraction()` method
   - Improved error messages and logging

3. **`backend/src/utils/textProcessingUtils.ts`**
   - Enhanced PDF extraction with better error handling
   - Added page-by-page extraction with error recovery

4. **`backend/src/services/matchingService.ts`**
   - Updated matching algorithm with technical term detection
   - Better logging of calculation steps

---

## ✅ Verification Checklist

After making these changes:

- [ ] Backend compiles without errors: `npm run build`
- [ ] Backend starts successfully: `npm run dev`
- [ ] Debug endpoint works: `POST /api/matching/debug-extract`
- [ ] Jobs are inserted: `GET /api/jobs/insert-sample`
- [ ] Matching works: Can upload resume and see match percentages
- [ ] Matches are above 0%: If resume has relevant skills
- [ ] Match percentages vary: Different jobs show different percentages

---

## 🚀 Next Steps if Still Not Working

If you're still getting 0% matches after these fixes:

1. **Run the debug endpoint** and share the output
2. **Check backend console logs** for error messages
3. **Verify MongoDB is running** with `mongod` command
4. **Test with a .txt file** instead of PDF to isolate the issue
5. **Check file permissions** on the resume.pdf file

---

## 📱 API Endpoints Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/matching/compare` | ❌ No | Compare resume vs JD |
| POST | `/api/matching/debug-extract` | ❌ No | Test text extraction |
| GET | `/api/matching/history` | ✅ Yes | Get user match history |
| GET | `/api/jobs/insert-sample` | ❌ No | Load 54 sample jobs |
| GET | `/api/jobs/list` | ❌ No | List all jobs |

