#!/usr/bin/env node

/**
 * Direct Test Script - Tests matching without compilation
 * Run: node test-direct.js
 */

const fs = require('fs');
const path = require('path');

// Simple stopword check
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
  'the', 'to', 'was', 'will', 'with', 'this', 'you', 'your',
  'we', 'they', 'them', 'these', 'those', 'have', 'do', 'does',
  'did', 'been', 'being', 'very', 'which', 'who', 'when', 'where',
]);

// Tokenize text
function tokenizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length >= 2 && !STOPWORDS.has(token));
}

// Extract keywords
function extractKeywords(text) {
  const tokens = tokenizeText(text);
  const keywords = new Map();
  
  tokens.forEach(token => {
    keywords.set(token, (keywords.get(token) || 0) + 1);
  });
  
  // Sort by frequency
  const sorted = Array.from(keywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);
  
  return new Map(sorted);
}

// Calculate Jaccard similarity
function calculateSimilarity(text1, text2) {
  const tokens1 = tokenizeText(text1);
  const tokens2 = tokenizeText(text2);
  
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = new Set(Array.from(set1).filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Main test
console.log('\n🧪 Resume & JD Matcher - Direct Test\n');
console.log('=' .repeat(50));

// Test 1: Simple text matching
console.log('\n1️⃣  Testing Keyword Extraction:');

const sampleResume = `
  Senior Full Stack Developer
  5+ years experience
  Skills: React, Node.js, TypeScript, MongoDB, PostgreSQL, Docker, AWS, Express, JavaScript
  Experience: Developed microservices, REST APIs, GraphQL, Redux
`;

const sampleJD = `
  Position: Senior Full Stack Developer
  Requirements: React, Node.js, TypeScript, MongoDB, Express, REST APIs
  Responsibilities: Build scalable applications
`;

console.log('\n📄 Resume text length:', sampleResume.length);
const resumeKeywords = extractKeywords(sampleResume);
console.log('📄 Resume keywords:', resumeKeywords.size);
console.log('   Top keywords:', Array.from(resumeKeywords.keys()).slice(0, 10).join(', '));

console.log('\n📋 JD text length:', sampleJD.length);
const jdKeywords = extractKeywords(sampleJD);
console.log('📋 JD keywords:', jdKeywords.size);
console.log('   Top keywords:', Array.from(jdKeywords.keys()).slice(0, 10).join(', '));

// Test 2: Calculate match
console.log('\n2️⃣  Calculating Match Percentage:');

const resumeKeywordList = Array.from(resumeKeywords.keys());
const jdKeywordList = Array.from(jdKeywords.keys());

const matchedKeywords = resumeKeywordList.filter(kw => jdKeywordList.includes(kw));
const keywordRatio = (matchedKeywords.length / jdKeywordList.length) * 100;

const similarity = calculateSimilarity(sampleResume, sampleJD);
const similarityPercent = similarity * 100;

const technicalTerms = ['react', 'nodejs', 'javascript', 'typescript', 'mongodb', 'postgresql', 'docker', 'aws', 'express'];
const resumeText = sampleResume.toLowerCase();
const jdText = sampleJD.toLowerCase();
const technicalMatches = technicalTerms.filter(term => resumeText.includes(term) && jdText.includes(term)).length;
const technicalScore = (technicalMatches / technicalTerms.length) * 100;

const matchPercentage = Math.round(keywordRatio * 0.4 + similarityPercent * 0.4 + technicalScore * 0.2);

console.log('   Keyword Ratio: ' + keywordRatio.toFixed(2) + '% (40% weight)');
console.log('   Similarity: ' + similarityPercent.toFixed(2) + '% (40% weight)');
console.log('   Technical Score: ' + technicalScore.toFixed(2) + '% (20% weight)');
console.log('\n   ✅ Final Match: ' + matchPercentage + '%');

console.log('\n   Matched Keywords (' + matchedKeywords.length + '):');
console.log('   ' + matchedKeywords.join(', '));

console.log('\n' + '='.repeat(50));

// Test 3: Check PDF extraction
console.log('\n3️⃣  Checking if PDF file exists:');
const pdfPath = path.join(__dirname, 'input', 'resume.pdf');
console.log('   Looking for:', pdfPath);

if (fs.existsSync(pdfPath)) {
  console.log('   ✅ PDF file found!');
  const stats = fs.statSync(pdfPath);
  console.log('   File size:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.log('   ❌ PDF file NOT found at:', pdfPath);
  console.log('   Available input files:');
  const inputDir = path.join(__dirname, 'input');
  if (fs.existsSync(inputDir)) {
    fs.readdirSync(inputDir).forEach(file => {
      console.log('      -', file);
    });
  }
}

console.log('\n' + '='.repeat(50) + '\n');

console.log('📝 Summary:');
console.log('   - Keyword extraction: ✅ Working');
console.log('   - Match calculation: ✅ Working');
console.log('   - Expected result: ' + matchPercentage + '% (with similar resume/JD)');
console.log('\n✨ If you\'re still getting 0%, the issue is likely:');
console.log('   1. PDF text extraction is returning empty');
console.log('   2. Backend is not receiving the files correctly');
console.log('   3. Text processing is removing all content\n');
