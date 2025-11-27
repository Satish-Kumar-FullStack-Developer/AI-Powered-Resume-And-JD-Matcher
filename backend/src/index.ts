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

/**
 * IN-MEMORY DATABASES
 */
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  profilePicture?: string; // Base64 or URL
  designation?: string; // Job title
  industry?: string; // Industry
  workplaceType?: string; // Full-time, Contract, Freelance, etc.
  salaryExpectation?: string; // Salary range
  resumeText?: string;
  profileCompletion?: number;
}

interface SavedJob {
  jobId: string;
  savedAt: string;
}

const users: Map<string, UserProfile> = new Map();
const savedJobs: Map<string, SavedJob[]> = new Map();

// Create default user
const defaultUser: UserProfile = {
  id: 'user_1',
  name: 'Full Stack Developer',
  email: 'developer@email.com',
  phone: '+91-9876543210',
  location: 'Bangalore, India',
  experience: '5+ Years',
  skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
  designation: 'Senior Developer',
  industry: 'IT Services',
  workplaceType: 'Full-time',
  salaryExpectation: '12-15 LPA',
  profilePicture: undefined,
  profileCompletion: 100,
};
users.set(defaultUser.id, defaultUser);
savedJobs.set(defaultUser.id, []);

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
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str || '').join(' ');
        fullText += pageText + ' ';
      } catch (e) {
        console.error(`Error on page ${i}:`, e);
      }
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw error;
  }
}

// Extract email from text
function extractEmail(text: string): string {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : '';
}

// Extract phone from text
function extractPhone(text: string): string {
  const phoneMatch = text.match(/(\+91[-.\s]?)?[0-9]{10}|(\+1[-.\s]?)?[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
  return phoneMatch ? phoneMatch[0] : '';
}

// Extract name from first few lines
function extractName(text: string): string {
  const lines = text.split('\n').slice(0, 5);
  for (const line of lines) {
    const trimmed = line.trim();
    // Look for lines with 2-4 words that might be a name
    const words = trimmed.split(/\s+/).filter(w => w.length > 2);
    if (words.length >= 2 && words.length <= 4 && !trimmed.match(/\d{4,}/)) {
      return trimmed;
    }
  }
  return 'Professional';
}

// Extract skills from resume
function extractSkillsFromResume(text: string): string[] {
  const commonSkills = [
    'react', 'angular', 'vue', 'nodejs', 'node.js', 'python', 'java', 'golang', 'csharp', 'c#',
    'typescript', 'javascript', 'mongodb', 'mysql', 'postgresql', 'oracle', 'dynamodb',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'express', 'django', 'flask', 'spring',
    'graphql', 'rest', 'api', 'git', 'ci', 'cd', 'jenkins', 'gitlab', 'github',
    'redis', 'rabbitmq', 'kafka', 'sql', 'nosql', 'microservices', 'agile', 'scrum',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'vite', 'npm', 'yarn',
    'linux', 'windows', 'macos', 'selenium', 'testing', 'junit', 'pytest'
  ];

  const textLower = text.toLowerCase();
  const foundSkills = commonSkills.filter(skill => textLower.includes(skill));
  
  // Remove duplicates and return top skills
  return [...new Set(foundSkills)].slice(0, 15);
}

// Extract years of experience
function extractExperience(text: string): string {
  const expMatch = text.match(/(\d+)\s*(?:years?|yrs?|y)\s+(?:of\s+)?(?:experience|exp)/i);
  if (expMatch) {
    return `${expMatch[1]}+ Years`;
  }
  return '1-2 Years';
}

// Calculate profile completion percentage
function calculateProfileCompletion(user: UserProfile): number {
  let completionScore = 0;
  const maxScore = 100;
  
  // Profile Picture: 15 points
  if (user.profilePicture && user.profilePicture.trim().length > 0) {
    completionScore += 15;
  }
  
  // Name: 14 points
  if (user.name && user.name.trim().length > 0 && user.name !== 'Professional') {
    completionScore += 14;
  }
  
  // Email: 14 points
  if (user.email && user.email.includes('@')) {
    completionScore += 14;
  }
  
  // Phone: 14 points
  if (user.phone && user.phone.length > 0) {
    completionScore += 14;
  }
  
  // Location: 14 points
  if (user.location && user.location.trim().length > 0) {
    completionScore += 14;
  }
  
  // Experience: 14 points
  if (user.experience && user.experience.trim().length > 0) {
    completionScore += 14;
  }
  
  // Additional Profile Fields (Designation, Industry, WorkplaceType, Salary): 15 points total
  let fieldCount = 0;
  if (user.designation && user.designation.trim().length > 0) fieldCount++;
  if (user.industry && user.industry.trim().length > 0) fieldCount++;
  if (user.workplaceType && user.workplaceType.trim().length > 0) fieldCount++;
  if (user.salaryExpectation && user.salaryExpectation.trim().length > 0) fieldCount++;
  
  completionScore += (fieldCount / 4) * 15; // Max 15 points for these 4 fields
  
  return Math.min(Math.round(completionScore), maxScore);
}

// Tokenize text
function tokenizeText(text: string): string[] {
  const stopwords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
    'the', 'to', 'was', 'will', 'with', 'this', 'you', 'your', 'have'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !stopwords.has(t));
}

// Extract keywords
function extractKeywords(text: string, limit: number = 50): Set<string> {
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

// Calculate match percentage - Improved algorithm
function calculateMatch(resumeText: string, jdText: string): number {
  if (!resumeText || !jdText) return 0;

  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = extractKeywords(jdText);

  if (jdKeywords.size === 0 || resumeKeywords.size === 0) return 0;

  // 1. Keyword matching ratio
  const matchedKeywords = Array.from(jdKeywords).filter(kw => resumeKeywords.has(kw)).length;
  const keywordRatio = (matchedKeywords / jdKeywords.size) * 40; // 40% weight

  // 2. Jaccard similarity
  const union = new Set([...Array.from(resumeKeywords), ...Array.from(jdKeywords)]).size;
  const jaccardScore = (matchedKeywords / union) * 100;
  const jaccardComponent = (jaccardScore / 100) * 40; // 40% weight

  // 3. Technical skills match (20% weight)
  const techSkills = [
    'react', 'angular', 'vue', 'nodejs', 'node.js', 'python', 'java', 'golang', 'csharp', 'c#',
    'typescript', 'javascript', 'mongodb', 'mysql', 'postgresql', 'oracle', 'dynamodb',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'express', 'django', 'flask', 'spring',
    'graphql', 'rest', 'api', 'git', 'ci', 'cd', 'jenkins', 'gitlab', 'github',
    'redis', 'rabbitmq', 'kafka', 'sql', 'nosql', 'microservices', 'agile', 'scrum',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'vite', 'npm', 'yarn'
  ];

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const resumeTechCount = techSkills.filter(skill => resumeLower.includes(skill)).length;
  const jdTechCount = techSkills.filter(skill => jdLower.includes(skill)).length;
  const commonTechCount = techSkills.filter(skill => resumeLower.includes(skill) && jdLower.includes(skill)).length;

  let techScore = 0;
  if (jdTechCount > 0) {
    techScore = (commonTechCount / jdTechCount) * 20; // 20% weight
  }

  // 4. Text length bonus - ensure non-zero matches have minimum score
  const lengthBonus = resumeText.length > 100 && jdText.length > 100 ? 5 : 0;

  const finalScore = keywordRatio + jaccardComponent + techScore + lengthBonus;

  // Ensure minimum match if there's any overlap
  if (matchedKeywords > 0 && finalScore < 15) {
    return Math.max(15, Math.round(finalScore));
  }

  return Math.round(Math.min(100, Math.max(0, finalScore)));
}

/**
 * SAMPLE JOBS DATABASE
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
  level: string;
}

let jobsDatabase: Job[] = [];

function generateSampleJobs(): void {
  const companies = ['TechCorp', 'InnovateLabs', 'CloudSys', 'DataDrive', 'WebForce', 'ByteStream', 'CodeNation'];
  const positions = [
    { title: 'Senior Full Stack Developer', level: 'Senior' },
    { title: 'React Developer', level: 'Mid' },
    { title: 'Node.js Backend Developer', level: 'Mid' },
    { title: 'Full Stack Engineer', level: 'Senior' },
    { title: 'Junior Software Engineer', level: 'Junior' },
    { title: 'DevOps Engineer', level: 'Mid' },
    { title: 'Solutions Architect', level: 'Senior' },
  ];

  jobsDatabase = [];
  let id = 1;

  positions.forEach((pos, posIdx) => {
    companies.forEach((company, compIdx) => {
      const baseSalary = 20 + compIdx * 5;
      const jobTypeIndex = (posIdx + compIdx) % 2;
      
      const job: Job = {
        _id: `job_${id}`,
        position: pos.title,
        company: company,
        location: ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi'][Math.floor(Math.random() * 5)] + ', India',
        salary: `${baseSalary} - ${baseSalary + 10} LPA`,
        experience: `${2 + (posIdx % 3)} - ${5 + (posIdx % 3)} years`,
        jobType: jobTypeIndex === 0 ? 'Full-time' : 'Contract',
        level: pos.level,
        description: `
          We are looking for a ${pos.title} to join our team.
          
          Required Skills:
          ${posIdx === 0 ? 'React, Node.js, TypeScript, MongoDB, PostgreSQL, Docker, AWS, Express, REST APIs, GraphQL, Redux, Microservices, Git, CICD' : ''}
          ${posIdx === 1 ? 'React, JavaScript, TypeScript, Redux, REST APIs, GraphQL, Tailwind CSS, Webpack, Testing, Git' : ''}
          ${posIdx === 2 ? 'Node.js, Express, MongoDB, PostgreSQL, REST APIs, Microservices, GraphQL, JWT, Redis, Docker' : ''}
          ${posIdx === 3 ? 'Full Stack Development, React, Node.js, Database Design, REST APIs, Docker, AWS' : ''}
          ${posIdx === 4 ? 'JavaScript, HTML, CSS, React, Git, Problem Solving, Testing' : ''}
          ${posIdx === 5 ? 'Docker, Kubernetes, AWS, CI/CD, Linux, Infrastructure, Monitoring, Jenkins, GitLab' : ''}
          ${posIdx === 6 ? 'System Design, Architecture, Cloud Platforms, Leadership, Technical Mentoring, Microservices' : ''}
          
          About the Role:
          - Design and develop scalable applications
          - Collaborate with cross-functional teams
          - Write clean, maintainable, and well-tested code
          - Participate in code reviews and architectural discussions
          - ${pos.level === 'Senior' ? 'Mentor junior developers and lead technical initiatives' : 'Contribute to feature development'}
          
          Why Join Us:
          - Competitive salary and benefits
          - Flexible work arrangements
          - Career growth opportunities
          - Learning and development programs
          - Collaborative and innovative work environment
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

// Get all jobs with filters
app.get('/api/jobs', (req: Request, res: Response) => {
  let filtered = [...jobsDatabase];

  // Experience filter
  const expFilter = req.query.experience as string;
  if (expFilter && expFilter !== 'all') {
    filtered = filtered.filter(j => j.experience.includes(expFilter));
  }

  // Salary filter
  const salaryFilter = req.query.salary as string;
  if (salaryFilter && salaryFilter !== 'all') {
    const minSalary = parseInt(salaryFilter);
    filtered = filtered.filter(j => {
      const baseSalary = parseInt(j.salary.split('-')[0]);
      return baseSalary >= minSalary;
    });
  }

  // Job type filter
  const jobTypeFilter = req.query.jobType as string;
  if (jobTypeFilter && jobTypeFilter !== 'all') {
    filtered = filtered.filter(j => j.jobType === jobTypeFilter);
  }

  // Level filter
  const levelFilter = req.query.level as string;
  if (levelFilter && levelFilter !== 'all') {
    filtered = filtered.filter(j => j.level === levelFilter);
  }

  // Location filter
  const locationFilter = req.query.location as string;
  if (locationFilter && locationFilter !== 'all') {
    filtered = filtered.filter(j => j.location.includes(locationFilter));
  }

  // Search
  const search = req.query.search as string;
  if (search) {
    filtered = filtered.filter(j =>
      j.position.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
});

// Get user profile
app.get('/api/user/profile', (req: Request, res: Response) => {
  const userId = req.query.userId as string || 'user_1';
  const user = users.get(userId);

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  res.json({
    success: true,
    data: user,
  });
});

// Update user profile
app.post('/api/user/profile', express.json(), (req: Request, res: Response) => {
  const userId = req.body.userId || 'user_1';
  const user = users.get(userId);

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  // Update user
  Object.assign(user, req.body);
  user.profileCompletion = calculateProfileCompletion(user);
  users.set(userId, user);

  res.json({
    success: true,
    data: user,
  });
});

// Get saved jobs
app.get('/api/user/saved-jobs', (req: Request, res: Response) => {
  const userId = req.query.userId as string || 'user_1';
  const saved = savedJobs.get(userId) || [];
  
  const savedJobDetails = saved
    .map(s => jobsDatabase.find(j => j._id === s.jobId))
    .filter(Boolean) as Job[];

  res.json({
    success: true,
    count: savedJobDetails.length,
    data: savedJobDetails,
  });
});

// Save a job
app.post('/api/user/save-job', express.json(), (req: Request, res: Response) => {
  const { userId = 'user_1', jobId } = req.body;
  
  if (!jobId) {
    res.status(400).json({ success: false, error: 'Job ID required' });
    return;
  }

  let userSaved = savedJobs.get(userId) || [];
  
  // Check if already saved
  if (!userSaved.find(s => s.jobId === jobId)) {
    userSaved.push({
      jobId,
      savedAt: new Date().toISOString(),
    });
    savedJobs.set(userId, userSaved);
  }

  res.json({
    success: true,
    message: 'Job saved',
  });
});

// Remove saved job
app.post('/api/user/unsave-job', express.json(), (req: Request, res: Response) => {
  const { userId = 'user_1', jobId } = req.body;
  
  let userSaved = savedJobs.get(userId) || [];
  userSaved = userSaved.filter(s => s.jobId !== jobId);
  savedJobs.set(userId, userSaved);

  res.json({
    success: true,
    message: 'Job removed from saved',
  });
});

// Upload profile picture
app.post('/api/user/profile-picture', upload.single('profilePicture'), (req: Request, res: Response) => {
  const userId = 'user_1';
  const user = users.get(userId);
  
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ success: false, error: 'No file uploaded' });
    return;
  }

  try {
    // Read the uploaded file and convert to base64
    const fileData = fs.readFileSync(req.file.path);
    const base64Data = fileData.toString('base64');
    const mimeType = req.file.mimetype;
    const profilePictureData = `data:${mimeType};base64,${base64Data}`;
    
    // Store the profile picture
    user.profilePicture = profilePictureData;
    user.profileCompletion = calculateProfileCompletion(user);
    users.set(userId, user);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      message: 'Profile picture uploaded',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to upload profile picture' });
  }
});

// Match resume against all jobs
app.post('/api/match-all', upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'Resume required' });
      return;
    }

    let resumeText = '';

    if (req.file.path.endsWith('.pdf')) {
      resumeText = await extractPDFText(req.file.path);
    } else {
      resumeText = fs.readFileSync(req.file.path, 'utf-8');
    }

    console.log('Resume extracted:', resumeText.length, 'chars');

    if (resumeText.length === 0) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      res.status(400).json({ success: false, error: 'Could not extract resume text' });
      return;
    }

    // Extract profile data from resume
    const userId = 'user_1';
    const user = users.get(userId);
    if (user) {
      user.resumeText = resumeText;
      user.name = extractName(resumeText) || user.name;
      const email = extractEmail(resumeText);
      if (email) user.email = email;
      const phone = extractPhone(resumeText);
      if (phone) user.phone = phone;
      user.skills = extractSkillsFromResume(resumeText);
      user.experience = extractExperience(resumeText);
      user.profileCompletion = calculateProfileCompletion(user);
      users.set(userId, user);
      console.log('Profile updated from resume:', { name: user.name, email: user.email, skills: user.skills, completion: user.profileCompletion });
    }

    // Match against all jobs
    const results = jobsDatabase.map(job => {
      const matchPercentage = calculateMatch(resumeText, job.description);
      return {
        ...job,
        matchPercentage,
      };
    });

    // Sort by match percentage
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Cleanup
    try { fs.unlinkSync(req.file.path); } catch (e) {}

    res.json({
      success: true,
      count: results.length,
      data: results,
      resumeLength: resumeText.length,
    });
  } catch (error) {
    console.error('Match all error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get filter options
app.get('/api/filters', (req: Request, res: Response) => {
  const experiences = new Set(jobsDatabase.map(j => j.experience));
  const levels = new Set(jobsDatabase.map(j => j.level));
  const jobTypes = new Set(jobsDatabase.map(j => j.jobType));
  const locations = new Set(jobsDatabase.map(j => j.location.split(',')[0]));
  const salaries = new Set(jobsDatabase.map(j => {
    const base = parseInt(j.salary.split('-')[0]);
    return Math.ceil(base / 10) * 10;
  }));

  // Profile dropdown options (Naukri-style)
  const profileOptions = {
    designations: [
      'Software Engineer',
      'Senior Software Engineer',
      'Lead Developer',
      'Full Stack Developer',
      'Frontend Developer',
      'Backend Developer',
      'DevOps Engineer',
      'Solutions Architect',
      'Technical Lead',
      'Engineering Manager',
    ],
    industries: [
      'IT Services',
      'Software Product',
      'BFSI',
      'Healthcare',
      'E-commerce',
      'EdTech',
      'FinTech',
      'Media & Entertainment',
      'Telecom',
      'Manufacturing',
      'Consulting',
      'Startup',
    ],
    workplaceTypes: [
      'Full-time',
      'Contract',
      'Freelance',
      'Part-time',
      'Temporary',
    ],
    salaryRanges: [
      '3-5 LPA',
      '5-8 LPA',
      '8-12 LPA',
      '12-15 LPA',
      '15-20 LPA',
      '20-25 LPA',
      '25-30 LPA',
      '30-40 LPA',
      '40-50 LPA',
      '50+ LPA',
    ],
  };

  res.json({
    success: true,
    data: {
      experiences: Array.from(experiences),
      levels: Array.from(levels),
      jobTypes: Array.from(jobTypes),
      locations: Array.from(locations),
      salaries: Array.from(salaries).sort((a, b) => a - b),
      profileOptions,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Jobs loaded: ${jobsDatabase.length}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/jobs`);
});

export default app;
