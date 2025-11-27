import JobDescription from '../models/JobDescription';
import { Request, Response } from 'express';

export const addJobDescription = async (req: Request, res: Response) => {
  try {
    const { position, company, location, salary, experience, jobType, summary, description } = req.body;
    const job = await JobDescription.create({ 
      position, 
      company, 
      location, 
      salary, 
      experience, 
      jobType, 
      summary, 
      description 
    });
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding job description', error: err });
  }
};

export const listJobDescriptions = async (_req: Request, res: Response) => {
  try {
    const jobs = await JobDescription.find().sort({ postedDate: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching job descriptions', error: err });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await JobDescription.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching job', error: err });
  }
};

export const insertSampleJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = [
      {
        position: 'Senior Full Stack Developer - 100% Match',
        company: 'Tech Innovations Corp',
        location: 'Remote / Hybrid',
        salary: '$120,000 - $160,000',
        experience: '5+ years',
        jobType: 'Full-time',
        summary: 'Join our engineering team to work on cutting-edge web applications using React, Node.js, TypeScript, and MongoDB.',
        description: `JOB DESCRIPTION
Position: Senior Full Stack Developer
Company: Tech Innovations Corp
Location: Remote / Hybrid
Salary: $120,000 - $160,000

COMPANY OVERVIEW
Tech Innovations Corp is a leading software development company specializing in enterprise solutions for Fortune 500 companies. We are committed to building cutting-edge applications and fostering a culture of innovation and continuous learning.

POSITION OVERVIEW
We are seeking an experienced Senior Full Stack Developer to join our growing engineering team. You will work on cutting-edge web applications, mentor junior developers, and contribute to architectural decisions. This is a high-impact role where you'll have the opportunity to shape the technical direction of our products.

REQUIRED QUALIFICATIONS & SKILLS
• 5+ years of professional web development experience
• Expert-level knowledge of JavaScript and TypeScript
• Strong proficiency in React for frontend development
• Strong proficiency in Node.js and Express.js for backend development
• Experience designing and implementing RESTful APIs
• Proficiency with MongoDB and relational databases (PostgreSQL, MySQL)
• Experience with microservices architecture
• Git version control and collaborative development workflows
• Strong understanding of software design patterns and SOLID principles
• Experience with authentication and authorization (JWT, OAuth)
• Excellent problem-solving and communication skills
• Redux state management
• Tailwind CSS styling
• Docker and containerization
• AWS or Google Cloud Platform experience
• CI/CD pipeline implementation and DevOps experience

PREFERRED QUALIFICATIONS
• GraphQL experience
• Agile/Scrum methodology experience
• Leadership and mentoring experience with junior developers
• Open source contributions
• Published technical blog or GitHub portfolio

RESPONSIBILITIES
• Design and develop full stack web applications using React and Node.js with TypeScript
• Build and maintain scalable backend services and microservices
• Collaborate with cross-functional teams including product managers and designers
• Conduct code reviews and ensure code quality standards
• Mentor and support junior developers in their professional growth
• Implement and optimize MongoDB databases
• Deploy applications using Docker and AWS

WHAT WE OFFER
• Competitive salary: $120,000 - $160,000 DOE
• Comprehensive health insurance (medical, dental, vision)
• 401(k) matching up to 5%
• Flexible remote work arrangement
• Professional development budget: $2,000 per year
• Generous PTO: 20 days paid time off`
      },
      {
        position: 'React Developer - 90% Match',
        company: 'Web Solutions Inc',
        location: 'New York, NY',
        salary: '$90,000 - $120,000',
        experience: '3+ years',
        jobType: 'Full-time',
        summary: 'Build responsive web applications using React, TypeScript, Redux, and Tailwind CSS.',
        description: `JOB DESCRIPTION
Position: React Developer
Company: Web Solutions Inc
Location: New York, NY
Salary: $90,000 - $120,000
Experience Required: 3+ years

POSITION OVERVIEW
Build responsive and interactive web applications using React, Redux, and TypeScript. Work with REST APIs and modern web technologies to create engaging user experiences.

REQUIRED SKILLS
• 3+ years of React development experience
• Strong JavaScript and TypeScript knowledge
• Experience with Redux state management
• Tailwind CSS and responsive design
• REST API integration
• Git version control
• React hooks and functional components
• Component reusability and best practices
• Problem-solving and communication skills

NICE TO HAVE
• Experience with Next.js
• Testing with Jest and React Testing Library
• Webpack or Vite experience
• Performance optimization

RESPONSIBILITIES
• Develop and maintain React components using TypeScript
• Optimize application performance
• Collaborate with backend developers using REST APIs
• Write clean, maintainable code with best practices
• Participate in code reviews
• Style components with Tailwind CSS

WHAT WE OFFER
• Competitive salary package
• Health insurance
• Professional development opportunities
• Collaborative work environment
• Remote work options`
      },
      {
        position: 'Backend Engineer (Node.js) - 70% Match',
        company: 'Cloud Systems Ltd',
        location: 'San Francisco, CA',
        salary: '$110,000 - $150,000',
        experience: '4+ years',
        jobType: 'Full-time',
        summary: 'Develop scalable backend services using Node.js, Express, and MongoDB.',
        description: `JOB DESCRIPTION
Position: Backend Engineer (Node.js)
Company: Cloud Systems Ltd
Location: San Francisco, CA
Salary: $110,000 - $150,000
Experience Required: 4+ years

POSITION OVERVIEW
Develop and maintain robust backend services using Node.js and Express. Design microservices architecture, implement REST APIs, and optimize database performance for large-scale applications.

REQUIRED SKILLS
• 4+ years of Node.js development
• Express.js framework expertise
• RESTful API design and development
• Database design (SQL and NoSQL - MongoDB preferred)
• Microservices architecture concepts
• JavaScript fundamentals

PREFERRED SKILLS
• Docker containerization
• AWS deployment and management
• CI/CD pipeline knowledge
• Redis caching
• Authentication and security best practices
• Postman or similar API testing tools

RESPONSIBILITIES
• Design and implement RESTful backend services
• Optimize database queries and performance
• Build scalable APIs for web and mobile applications
• Implement security measures and authentication
• Deploy and maintain production systems
• Troubleshoot and debug issues

WHAT WE OFFER
• Competitive salary package
• Health insurance coverage
• Remote work flexibility
• Career growth opportunities
• Learning and development budget`
      },
      {
        position: 'Frontend Developer - 50% Match',
        company: 'Digital Agency Pro',
        location: 'Austin, TX',
        salary: '$80,000 - $110,000',
        experience: '2+ years',
        jobType: 'Full-time',
        summary: 'Create engaging user interfaces using modern frontend technologies.',
        description: `JOB DESCRIPTION
Position: Frontend Developer
Company: Digital Agency Pro
Location: Austin, TX
Salary: $80,000 - $110,000
Experience Required: 2+ years

POSITION OVERVIEW
Join our creative team to build stunning user interfaces and web experiences. Work with HTML, CSS, and Vue.js to bring designs to life.

REQUIRED SKILLS
• 2+ years of frontend development experience
• Strong HTML and CSS knowledge
• Vue.js framework experience
• jQuery expertise
• Adobe XD or Figma design tool familiarity
• WordPress theme customization
• SEO basics

PREFERRED SKILLS
• SASS/SCSS preprocessing
• Bootstrap framework
• PHP basics
• Animation libraries (GSAP)
• Web performance optimization
• Cross-browser compatibility testing

RESPONSIBILITIES
• Develop responsive web interfaces
• Implement designs from mockups
• Collaborate with designers and backend team
• Optimize website performance
• Maintain code quality and standards
• Support SEO implementation

WHAT WE OFFER
• Competitive salary
• Health insurance
• Collaborative environment
• Flexible work hours
• Professional growth opportunities`
      },
      // 90% Match - Senior React Developer
      { position: 'Senior React Developer', company: 'Interactive Solutions Ltd', location: 'Remote', salary: '$110,000 - $150,000', experience: '5+ years', jobType: 'Full-time', summary: 'Expert React developer needed for building enterprise applications', description: 'React, TypeScript, Redux, Testing, Performance Optimization, Webpack, Babel, Material-UI, Responsive Design, REST APIs, GraphQL, Next.js, CSS-in-JS, Jest, React Router, State Management' },
      // 85% Match - Full Stack Engineer
      { position: 'Full Stack Engineer', company: 'Digital Ventures', location: 'San Francisco, CA', salary: '$130,000 - $170,000', experience: '5+ years', jobType: 'Full-time', summary: 'Build scalable full stack solutions', description: 'JavaScript, TypeScript, React, Angular, Node.js, Python, Django, Flask, MongoDB, PostgreSQL, Docker, Kubernetes, AWS, Azure, Git, CI/CD' },
      // 80% Match - Senior JavaScript Developer
      { position: 'Senior JavaScript Developer', company: 'Web Tech Pioneers', location: 'Remote', salary: '$100,000 - $140,000', experience: '4+ years', jobType: 'Full-time', summary: 'Master JavaScript for modern web development', description: 'JavaScript ES6+, TypeScript, React, Vue.js, Node.js, Express, Webpack, Babel, Git, REST APIs, Async/Await, Promises, Callbacks, JSON' },
      // 78% Match - Backend Node.js Developer
      { position: 'Backend Node.js Developer', company: 'Cloud Infrastructure Inc', location: 'Remote', salary: '$105,000 - $145,000', experience: '4+ years', jobType: 'Full-time', summary: 'Build robust Node.js backends', description: 'Node.js, Express, TypeScript, MongoDB, PostgreSQL, Redis, Docker, Microservices, RESTful APIs, Authentication, JWT, OAuth, Postman' },
      // 75% Match - Frontend React Engineer
      { position: 'Frontend React Engineer', company: 'UI/UX Tech', location: 'New York, NY', salary: '$95,000 - $135,000', experience: '3+ years', jobType: 'Full-time', summary: 'Develop beautiful React interfaces', description: 'React, TypeScript, Redux, CSS, Tailwind, Material-UI, Responsive Design, Accessibility, Performance, Testing, Git, Figma' },
      // 72% Match - JavaScript Full Stack Developer
      { position: 'JavaScript Full Stack Developer', company: 'StartUp Connect', location: 'Remote', salary: '$90,000 - $130,000', experience: '3+ years', jobType: 'Full-time', summary: 'Full stack JavaScript development', description: 'JavaScript, React, Node.js, Express, MongoDB, PostgreSQL, HTML, CSS, Git, REST APIs, JSON, Agile' },
      // 70% Match - Web Developer
      { position: 'Web Developer', company: 'Creative Agencies Plus', location: 'Austin, TX', salary: '$80,000 - $120,000', experience: '2+ years', jobType: 'Full-time', summary: 'Build responsive web applications', description: 'JavaScript, HTML, CSS, React, Vue, Node.js, Bootstrap, Tailwind, GitHub, Web Performance, SEO' },
      // 68% Match - API Developer
      { position: 'API Developer', company: 'Backend Solutions Co', location: 'Remote', salary: '$100,000 - $140,000', experience: '3+ years', jobType: 'Full-time', summary: 'Design and build RESTful APIs', description: 'Node.js, Express, TypeScript, MongoDB, PostgreSQL, REST, GraphQL, JWT, OAuth, Postman, Git' },
      // 65% Match - React Native Developer
      { position: 'React Native Developer', company: 'Mobile First Tech', location: 'Remote', salary: '$95,000 - $135,000', experience: '3+ years', jobType: 'Full-time', summary: 'Mobile app development with React Native', description: 'React Native, JavaScript, TypeScript, Redux, Firebase, Android, iOS, Git, Testing, Performance' },
      // 62% Match - Frontend Developer (Vue.js)
      { position: 'Frontend Developer (Vue.js)', company: 'Vue Masters', location: 'Remote', salary: '$85,000 - $125,000', experience: '2+ years', jobType: 'Full-time', summary: 'Vue.js frontend development', description: 'Vue.js, JavaScript, TypeScript, HTML, CSS, REST APIs, Vuex, Vue Router, Axios, Git' },
      // 60% Match - Junior Full Stack Developer
      { position: 'Junior Full Stack Developer', company: 'Growth Tech Labs', location: 'Remote', salary: '$60,000 - $90,000', experience: '1+ years', jobType: 'Full-time', summary: 'Entry-level full stack position', description: 'JavaScript, React, Node.js, HTML, CSS, MongoDB, Git, REST APIs, Problem Solving' },
      // 58% Match - Frontend Engineer (Angular)
      { position: 'Frontend Engineer (Angular)', company: 'Enterprise Solutions', location: 'Boston, MA', salary: '$100,000 - $140,000', experience: '4+ years', jobType: 'Full-time', summary: 'Angular frontend development for enterprise', description: 'Angular, TypeScript, JavaScript, RxJS, NgRx, HTML, CSS, Bootstrap, Git, Unit Testing' },
      // 55% Match - Python Developer
      { position: 'Python Developer', company: 'Data Systems Corp', location: 'Remote', salary: '$90,000 - $130,000', experience: '3+ years', jobType: 'Full-time', summary: 'Python backend development', description: 'Python, Django, Flask, FastAPI, PostgreSQL, MongoDB, REST APIs, Linux, Git, Problem Solving' },
      // 52% Match - Full Stack Python/React
      { position: 'Full Stack Python/React Developer', company: 'Tech Convergence', location: 'Remote', salary: '$105,000 - $145,000', experience: '4+ years', jobType: 'Full-time', summary: 'Python backend with React frontend', description: 'Python, Django, Flask, React, JavaScript, PostgreSQL, REST APIs, Docker, Git' },
      // 50% Match - Java Backend Developer
      { position: 'Java Backend Developer', company: 'Enterprise Java Corp', location: 'Chicago, IL', salary: '$95,000 - $135,000', experience: '3+ years', jobType: 'Full-time', summary: 'Java backend development', description: 'Java, Spring Boot, Spring Framework, PostgreSQL, MySQL, REST APIs, Git, Microservices' },
      // 48% Match - Full Stack Engineer (.NET/React)
      { position: 'Full Stack Engineer (.NET/React)', company: 'Microsoft Solutions', location: 'Seattle, WA', salary: '$110,000 - $150,000', experience: '4+ years', jobType: 'Full-time', summary: '.NET and React full stack', description: 'C#, .NET, React, JavaScript, SQL Server, Azure, REST APIs, Git' },
      // 45% Match - PHP Developer
      { position: 'PHP Developer', company: 'Web Hosting Plus', location: 'Remote', salary: '$70,000 - $110,000', experience: '2+ years', jobType: 'Full-time', summary: 'PHP backend development', description: 'PHP, Laravel, Symfony, MySQL, PostgreSQL, HTML, CSS, REST APIs, Git' },
      // 42% Match - WordPress Developer
      { position: 'WordPress Developer', company: 'Digital Marketing Agency', location: 'Remote', salary: '$60,000 - $100,000', experience: '2+ years', jobType: 'Full-time', summary: 'WordPress theme and plugin development', description: 'WordPress, PHP, JavaScript, CSS, HTML, MySQL, WooCommerce, SEO' },
      // 40% Match - iOS Developer
      { position: 'iOS Developer', company: 'Apple Partners', location: 'San Francisco, CA', salary: '$100,000 - $140,000', experience: '3+ years', jobType: 'Full-time', summary: 'Native iOS app development', description: 'Swift, Objective-C, iOS SDK, Xcode, Core Data, REST APIs, Git' },
      // 38% Match - Android Developer
      { position: 'Android Developer', company: 'Android First Solutions', location: 'Remote', salary: '$95,000 - $135,000', experience: '3+ years', jobType: 'Full-time', summary: 'Native Android app development', description: 'Kotlin, Java, Android Studio, Firebase, REST APIs, Material Design' },
      // 35% Match - DevOps Engineer
      { position: 'DevOps Engineer', company: 'Infrastructure Experts', location: 'Remote', salary: '$110,000 - $150,000', experience: '4+ years', jobType: 'Full-time', summary: 'Cloud infrastructure and automation', description: 'Linux, Docker, Kubernetes, AWS, Azure, CI/CD, Jenkins, Git, Terraform' },
      // 33% Match - Cloud Solutions Architect
      { position: 'Cloud Solutions Architect', company: 'Cloud Native Inc', location: 'Remote', salary: '$130,000 - $170,000', experience: '6+ years', jobType: 'Full-time', summary: 'Design cloud solutions', description: 'AWS, Azure, Google Cloud, Docker, Kubernetes, Architecture, Security, Compliance' },
      // 30% Match - Data Scientist
      { position: 'Data Scientist', company: 'AI Innovation Lab', location: 'Remote', salary: '$110,000 - $150,000', experience: '3+ years', jobType: 'Full-time', summary: 'Machine learning and data analysis', description: 'Python, R, TensorFlow, PyTorch, Pandas, NumPy, SQL, Machine Learning, Statistics' },
      // 28% Match - Database Administrator
      { position: 'Database Administrator', company: 'Data Management Corp', location: 'Chicago, IL', salary: '$90,000 - $130,000', experience: '4+ years', jobType: 'Full-time', summary: 'Database management and optimization', description: 'PostgreSQL, MySQL, Oracle, MongoDB, Backup, Replication, Performance Tuning' },
      // 25% Match - QA Automation Engineer
      { position: 'QA Automation Engineer', company: 'Quality Assurance Plus', location: 'Remote', salary: '$80,000 - $120,000', experience: '3+ years', jobType: 'Full-time', summary: 'Automated testing and QA', description: 'Selenium, Python, JavaScript, TestNG, Cucumber, CI/CD, Git' },
      // 22% Match - Tech Lead / Engineering Manager
      { position: 'Tech Lead / Engineering Manager', company: 'Tech Leadership Group', location: 'Remote', salary: '$140,000 - $180,000', experience: '6+ years', jobType: 'Full-time', summary: 'Lead technical teams', description: 'Leadership, Mentoring, Architecture, Project Management, Git, Agile' },
      // 20% Match - Solutions Architect
      { position: 'Solutions Architect', company: 'Enterprise Architecture', location: 'New York, NY', salary: '$140,000 - $180,000', experience: '8+ years', jobType: 'Full-time', summary: 'Design enterprise solutions', description: 'Architecture, Cloud, Microservices, Security, Best Practices, Consulting' },
      // 35% Match - TypeScript Developer
      { position: 'TypeScript Developer', company: 'Type Safe Systems', location: 'Remote', salary: '$100,000 - $140,000', experience: '3+ years', jobType: 'Full-time', summary: 'TypeScript specialist', description: 'TypeScript, JavaScript, Node.js, React, Testing, Git' },
      // 38% Match - GraphQL Developer
      { position: 'GraphQL Developer', company: 'API Innovations', location: 'Remote', salary: '$105,000 - $145,000', experience: '3+ years', jobType: 'Full-time', summary: 'GraphQL API development', description: 'GraphQL, Apollo, Node.js, TypeScript, MongoDB, PostgreSQL' },
      // 40% Match - REST API Developer
      { position: 'REST API Developer', company: 'API Services Inc', location: 'Remote', salary: '$95,000 - $135,000', experience: '3+ years', jobType: 'Full-time', summary: 'Build REST APIs', description: 'REST, Node.js, Express, Python, Django, TypeScript, JSON' },
      // 42% Match - Microservices Developer
      { position: 'Microservices Developer', company: 'Microservices Masters', location: 'Remote', salary: '$110,000 - $150,000', experience: '4+ years', jobType: 'Full-time', summary: 'Microservices architecture', description: 'Microservices, Docker, Kubernetes, Node.js, Java, Message Queues' },
      // 44% Match - Blockchain Developer
      { position: 'Blockchain Developer', company: 'Web3 Innovations', location: 'Remote', salary: '$120,000 - $160,000', experience: '3+ years', jobType: 'Full-time', summary: 'Blockchain and smart contracts', description: 'Solidity, Ethereum, Web3, JavaScript, Smart Contracts' },
      // 46% Match - Machine Learning Engineer
      { position: 'Machine Learning Engineer', company: 'AI Solutions Lab', location: 'Remote', salary: '$120,000 - $160,000', experience: '4+ years', jobType: 'Full-time', summary: 'Machine learning model development', description: 'Python, TensorFlow, PyTorch, Scikit-learn, Data Science, Statistics' },
      // 48% Match - Security Engineer
      { position: 'Security Engineer', company: 'Cybersecurity Pro', location: 'Remote', salary: '$115,000 - $155,000', experience: '4+ years', jobType: 'Full-time', summary: 'Application security and penetration testing', description: 'Security, Penetration Testing, OWASP, Encryption, Firewalls, Git' },
      // 50% Match - UX/UI Designer
      { position: 'UX/UI Designer', company: 'Design Studio', location: 'Remote', salary: '$80,000 - $120,000', experience: '3+ years', jobType: 'Full-time', summary: 'User experience and interface design', description: 'Figma, Sketch, Adobe XD, Prototyping, User Research, Accessibility' },
      // 52% Match - Product Manager
      { position: 'Product Manager', company: 'Product Excellence', location: 'Remote', salary: '$120,000 - $160,000', experience: '4+ years', jobType: 'Full-time', summary: 'Product strategy and management', description: 'Product Strategy, Roadmapping, Analytics, User Research, Agile' },
      // 54% Match - Senior Software Engineer
      { position: 'Senior Software Engineer', company: 'Software Mastery', location: 'Remote', salary: '$125,000 - $165,000', experience: '6+ years', jobType: 'Full-time', summary: 'Senior engineering role', description: 'Software Design, Architecture, Leadership, Code Quality, Best Practices' },
      // 56% Match - Principal Engineer
      { position: 'Principal Engineer', company: 'Tech Excellence', location: 'Remote', salary: '$150,000 - $200,000', experience: '8+ years', jobType: 'Full-time', summary: 'Principal technical leader', description: 'Architecture, Technical Strategy, Leadership, Mentoring, Best Practices' },
      // 58% Match - Distributed Systems Engineer
      { position: 'Distributed Systems Engineer', company: 'Scale Infinity', location: 'Remote', salary: '$130,000 - $170,000', experience: '5+ years', jobType: 'Full-time', summary: 'Large-scale distributed systems', description: 'Distributed Systems, Scalability, Load Balancing, Message Queues, Database Sharding' },
      // 60% Match - Performance Engineer
      { position: 'Performance Engineer', company: 'Speed Optimization', location: 'Remote', salary: '$115,000 - $155,000', experience: '4+ years', jobType: 'Full-time', summary: 'Application performance optimization', description: 'Performance Tuning, Profiling, Benchmarking, Database Optimization, Caching' },
      // 62% Match - Site Reliability Engineer
      { position: 'Site Reliability Engineer', company: 'Infrastructure Reliability', location: 'Remote', salary: '$120,000 - $160,000', experience: '4+ years', jobType: 'Full-time', summary: 'System reliability and uptime', description: 'Reliability, Monitoring, Incident Response, Automation, Linux' },
      // 64% Match - Platform Engineer
      { position: 'Platform Engineer', company: 'Platform Services', location: 'Remote', salary: '$115,000 - $155,000', experience: '4+ years', jobType: 'Full-time', summary: 'Internal platform development', description: 'Platform Architecture, Internal Tools, Kubernetes, Docker, CI/CD' },
      // 66% Match - Embedded Systems Developer
      { position: 'Embedded Systems Developer', company: 'IoT Solutions', location: 'Remote', salary: '$100,000 - $140,000', experience: '4+ years', jobType: 'Full-time', summary: 'Embedded systems and IoT', description: 'C, C++, Python, Arduino, Raspberry Pi, Microcontrollers' },
      // 68% Match - Game Developer
      { position: 'Game Developer', company: 'Game Studios', location: 'Remote', salary: '$90,000 - $130,000', experience: '3+ years', jobType: 'Full-time', summary: 'Game development', description: 'Unity, Unreal Engine, C#, C++, 3D Graphics, Physics' },
      // 70% Match - VR/AR Developer
      { position: 'VR/AR Developer', company: 'Reality Labs', location: 'Remote', salary: '$105,000 - $145,000', experience: '3+ years', jobType: 'Full-time', summary: 'Virtual and augmented reality', description: 'Unity, Unreal, VR, AR, 3D Graphics, C#' },
      // 72% Match - Mobile Web Developer
      { position: 'Mobile Web Developer', company: 'Mobile First Digital', location: 'Remote', salary: '$90,000 - $130,000', experience: '3+ years', jobType: 'Full-time', summary: 'Responsive mobile web development', description: 'HTML, CSS, JavaScript, React, Vue, Mobile Optimization' },
      // 74% Match - Progressive Web App Developer
      { position: 'Progressive Web App Developer', company: 'PWA Innovations', location: 'Remote', salary: '$95,000 - $135,000', experience: '3+ years', jobType: 'Full-time', summary: 'PWA and offline-first development', description: 'Service Workers, PWA, JavaScript, React, Offline Capabilities' },
      // 76% Match - Fullstack NodeJS Developer
      { position: 'Fullstack NodeJS Developer', company: 'Node Masters', location: 'Remote', salary: '$105,000 - $145,000', experience: '4+ years', jobType: 'Full-time', summary: 'Full stack Node.js development', description: 'Node.js, Express, React, TypeScript, MongoDB, PostgreSQL' },
      // 78% Match - Express.js Specialist
      { position: 'Express.js Specialist', company: 'Backend Excellence', location: 'Remote', salary: '$100,000 - $140,000', experience: '4+ years', jobType: 'Full-time', summary: 'Express.js backend specialist', description: 'Express.js, Node.js, TypeScript, REST APIs, Middleware, Authentication' },
      // 80% Match - React Ecosystem Developer
      { position: 'React Ecosystem Developer', company: 'React Experts', location: 'Remote', salary: '$110,000 - $150,000', experience: '4+ years', jobType: 'Full-time', summary: 'React and related technologies', description: 'React, Redux, Next.js, TypeScript, Testing, Performance' },
      // 82% Match - Frontend Architecture Engineer
      { position: 'Frontend Architecture Engineer', company: 'Frontend Excellence', location: 'Remote', salary: '$115,000 - $155,000', experience: '5+ years', jobType: 'Full-time', summary: 'Frontend architecture and design', description: 'Frontend Architecture, Design Systems, Performance, Testing' },
      // 84% Match - Full Stack Architect
      { position: 'Full Stack Architect', company: 'Architecture Excellence', location: 'Remote', salary: '$130,000 - $170,000', experience: '6+ years', jobType: 'Full-time', summary: 'Full stack system architecture', description: 'System Architecture, Scalability, Microservices, Cloud, Best Practices' },
      // 86% Match - Technical Architect
      { position: 'Technical Architect', company: 'Enterprise Architecture', location: 'Remote', salary: '$135,000 - $175,000', experience: '7+ years', jobType: 'Full-time', summary: 'Enterprise technical architecture', description: 'Enterprise Architecture, Cloud, Microservices, Security, Compliance' },
      // 88% Match - Engineering Director
      { position: 'Engineering Director', company: 'Tech Leadership', location: 'Remote', salary: '$160,000 - $200,000', experience: '8+ years', jobType: 'Full-time', summary: 'Lead engineering organization', description: 'Leadership, Team Management, Strategic Planning, Technical Vision' },
      // 95% Match - Senior Full Stack Engineer
      { position: 'Senior Full Stack Engineer', company: 'Tech Excellence Corp', location: 'Remote', salary: '$125,000 - $165,000', experience: '6+ years', jobType: 'Full-time', summary: 'Senior full stack engineering', description: 'React, Node.js, TypeScript, MongoDB, PostgreSQL, Docker, Kubernetes, AWS, GCP, Azure' },
    ];

    await JobDescription.deleteMany({});
    const result = await JobDescription.insertMany(jobs);
    res.status(201).json({ success: true, message: 'Sample jobs inserted successfully', jobs: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error inserting sample jobs', error: err });
  }
};
