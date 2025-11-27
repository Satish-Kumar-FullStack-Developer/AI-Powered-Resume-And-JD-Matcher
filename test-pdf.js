#!/usr/bin/env node

/**
 * PDF Extraction Test
 * Tests if pdfjs can extract text from PDFs
 */

const fs = require('fs');
const path = require('path');

async function testPDFExtraction() {
  console.log('\n🧪 PDF Extraction Test\n');
  console.log('=' .repeat(50));

  // Add backend to node path
  const backendPath = path.join(__dirname, 'backend', 'node_modules');
  if (fs.existsSync(backendPath)) {
    module.paths.push(backendPath);
  }

  const pdfPath = path.join(__dirname, 'input', 'resume.pdf');
  
  console.log('\n1️⃣  Checking PDF file:');
  console.log('   Path:', pdfPath);
  
  if (!fs.existsSync(pdfPath)) {
    console.log('   ❌ PDF file NOT found!');
    return;
  }
  
  const stats = fs.statSync(pdfPath);
  console.log('   ✅ File found - Size:', (stats.size / 1024).toFixed(2), 'KB');

  // Try to load pdfjs
  console.log('\n2️⃣  Trying to load pdfjs-dist:');
  try {
    const pdfjs = require('pdfjs-dist');
    console.log('   ✅ pdfjs-dist loaded successfully');
    console.log('   Version:', require('pdfjs-dist/package.json').version);
  } catch (err) {
    console.log('   ❌ Failed to load pdfjs-dist:');
    console.log('   Error:', err.message);
    console.log('\n   Trying fallback approach...');
    
    // Try alternative import
    try {
      const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
      console.log('   ✅ Loaded pdfjs legacy build');
    } catch (err2) {
      console.log('   ❌ Failed to load legacy build too');
      return;
    }
  }

  // Try to extract text
  console.log('\n3️⃣  Attempting to extract text from PDF:');
  
  try {
    let pdfjs;
    try {
      pdfjs = require('pdfjs-dist');
    } catch {
      pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
    }

    // Set worker
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.js');
    } catch (e) {
      console.log('   ⚠️  Could not set worker, continuing...');
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const uint8Array = new Uint8Array(pdfBuffer);
    const pdf = await pdfjs.getDocument(uint8Array).promise;
    
    console.log('   ✅ PDF loaded successfully');
    console.log('   Number of pages:', pdf.numPages);

    let fullText = '';
    let pageCount = 0;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map(item => item.str || '')
          .join(' ');
        fullText += pageText + ' ';
        pageCount++;
        console.log(`   ✅ Page ${pageNum}: ${pageText.substring(0, 50)}...`);
      } catch (pageError) {
        console.log(`   ⚠️  Error on page ${pageNum}:`, pageError.message);
      }
    }

    console.log('\n4️⃣  Extraction Result:');
    console.log('   ✅ Pages extracted:', pageCount);
    console.log('   ✅ Total text length:', fullText.length, 'characters');
    
    if (fullText.length > 100) {
      console.log('   ✅ Sample text:');
      console.log('   ' + fullText.substring(0, 150) + '...');
    } else {
      console.log('   ⚠️  Very short text extracted - might be empty PDF');
    }

  } catch (err) {
    console.log('   ❌ Error during extraction:');
    console.log('   ', err.message);
    console.log('\n   Stack:', err.stack.split('\n').slice(0, 3).join('\n'));
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

testPDFExtraction().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
