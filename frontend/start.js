#!/usr/bin/env node

/**
 * Custom React Start Script
 * Bypasses npm script execution to avoid path issues
 */

process.env.BROWSER = 'none';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.PORT = '3000';

// Import react-scripts start directly
const { spawn } = require('child_process');
const path = require('path');

// Get the path to react-scripts cmd
const scriptPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts.cmd');

// Start the dev server
const child = spawn(scriptPath, ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    BROWSER: 'none',
    SKIP_PREFLIGHT_CHECK: 'true',
    PORT: '3000'
  }
});

child.on('error', (err) => {
  console.error('Failed to start frontend:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});
