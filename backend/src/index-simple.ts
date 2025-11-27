import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import * as pdfjs from 'pdfjs-dist';
import * as fs from 'fs';
import * as path from 'path';

const app: Express = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Set pdfjs worker
const pdfWorker = require('pdfjs-dist/build/pdf.worker.js');

/**
 * UTILITY FUNCTIONS
 */

// Extract text from PDF
async function extractPDFText(filePath: string): Promise<string> {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(pdfBuffer);
    const pdf = await pdfjs.getDocument(uint8Array).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str || '').join(' ');
      fullText += pageText + ' ';
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw error;
  }
}

// Tokenize text
function tokenizeText(text: string): string[] {
  const stopwords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
    'the', 'to', 'was', 'will', 'with', 'this', 'you', 'your',
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !stopwords.has(t));
}

// Extract keywords
function extractKeywords(text: string, limit: number = 100): Set<string> {
  const tokens = tokenizeText(text);
  const freq = new Map<string, number>();

  tokens.forEach(token => {
    freq.set(token, (freq.get(token) || 0) + 1);
  });

  return new Set(
    Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word)
  );
}

// Calculate match percentage
function calculateMatch(resumeText: string, jdText: string): number {
  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = extractKeywords(jdText);

  const matched = Array.from(jdKeywords).filter(kw => resumeKeywords.has(kw)).length;
  const ratio = (matched / jdKeywords.size) * 100;

  // Technical terms bonus
  const techTerms = ['react', 'nodejs', 'typescript', 'javascript', 'mongodb', 'postgresql', 'docker', 'aws', 'express'];
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();
  const techMatches = techTerms.filter(t => resumeLower.includes(t) && jdLower.includes(t)).length;
  const techBonus = (techMatches / techTerms.length) * 20;

  return Math.round(Math.min(100, ratio + techBonus));
}

/**
 * SAMPLE JOBS DATABASE (IN-MEMORY)
 */
interface Job {
  _id: string;
  position: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  jobType: string;
  description: string;
  postedDate: string;
}

let jobsDatabase: Job[] = [];

function generateSampleJobs(): void {
  const companies = ['TechCorp', 'InnovateLabs', 'CloudSys', 'DataDrive', 'WebForce'];
  const positions = [
    'Senior Full Stack Developer',
    'React Developer',
    'Node.js Backend Developer',
    'Full Stack Engineer',
    'Software Engineer',
    'DevOps Engineer',
    'Solutions Architect',
  ];

  jobsDatabase = [];
  let id = 1;

  positions.forEach((pos, posIdx) => {
    companies.forEach((company, compIdx) => {
      const job: Job = {
        _id: `job_${id}`,
        position: pos,
        company: company,
        location: 'Bangalore, India',
        salary: `${20 + compIdx * 5} - ${30 + compIdx * 5} LPA`,
        experience: `${2 + (posIdx % 3)} - ${5 + (posIdx % 3)} years`,
        jobType: posIdx % 2 === 0 ? 'Full-time' : 'Contract',
        description: `
          We are looking for a ${pos}.
          
          Required Skills:
          ${posIdx === 0 ? '- React, Node.js, TypeScript, MongoDB, PostgreSQL, Docker, AWS, Express' : ''}
          ${posIdx === 1 ? '- React, JavaScript, TypeScript, Redux, REST APIs, GraphQL' : ''}
          ${posIdx === 2 ? '- Node.js, Express, MongoDB, PostgreSQL, REST APIs, microservices' : ''}
          ${posIdx === 3 ? '- Full Stack Development, React, Node.js, database design' : ''}
          ${posIdx === 4 ? '- Software Development, problem-solving, coding, testing' : ''}
          ${posIdx === 5 ? '- Docker, Kubernetes, AWS, CI/CD, Linux, infrastructure' : ''}
          ${posIdx === 6 ? '- Architecture design, system design, cloud platforms, leadership' : ''}
          
          Responsibilities:
          - Design and develop scalable applications
          - Collaborate with teams
          - Write clean, maintainable code
          - Participate in code reviews
        `,
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      jobsDatabase.push(job);
      id++;
    });
  });
}

// Initialize jobs
generateSampleJobs();

/**
 * API ENDPOINTS
 */

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', jobs: jobsDatabase.length });
});

// Get all jobs
app.get('/api/jobs', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: jobsDatabase.length,
    data: jobsDatabase,
  });
});

// Compare resume with job
app.post('/api/match', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const files = req.files as any;
    
    if (!files?.resume || !files?.jobDescription) {
      return res.status(400).json({ success: false, error: 'Missing files' });
    }

    const resumePath = files.resume[0].path;
    const jdPath = files.jobDescription[0].path;

    // Extract text
    let resumeText = '';
    let jdText = '';

    if (resumePath.endsWith('.pdf')) {
      resumeText = await extractPDFText(resumePath);
    } else {
      resumeText = fs.readFileSync(resumePath, 'utf-8');
    }

    if (jdPath.endsWith('.pdf')) {
      jdText = await extractPDFText(jdPath);
    } else {
      jdText = fs.readFileSync(jdPath, 'utf-8');
    }

    console.log('Resume text length:', resumeText.length);
    console.log('JD text length:', jdText.length);

    // Calculate match
    const matchPercentage = calculateMatch(resumeText, jdText);

    // Cleanup
    fs.unlinkSync(resumePath);
    fs.unlinkSync(jdPath);

    res.json({
      success: true,
      matchPercentage,
      resumeText: resumeText.substring(0, 200),
    });
  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Match resume against all jobs
app.post('/api/match-all', upload.single('resume'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Resume required' });
    }

    let resumeText = '';

    if (req.file.path.endsWith('.pdf')) {
      resumeText = await extractPDFText(req.file.path);
    } else {
      resumeText = fs.readFileSync(req.file.path, 'utf-8');
    }

    console.log('Resume extracted:', resumeText.length, 'chars');

    // Match against all jobs
    const results = jobsDatabase.map(job => {
      const matchPercentage = calculateMatch(resumeText, job.description);
      return {
        ...job,
        matchPercentage,
      };
    });

    // Sort by match
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Cleanup
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Match all error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Jobs loaded: ${jobsDatabase.length}`);
});

export default app;
