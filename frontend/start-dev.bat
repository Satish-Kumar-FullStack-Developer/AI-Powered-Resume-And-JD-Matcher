@echo off
setlocal enabledelayedexpansion

REM Get the directory where this batch file is located
set "DIR=%~dp0"

REM Set environment variables
set BROWSER=none
set SKIP_PREFLIGHT_CHECK=true
set PORT=3000
set NODE_ENV=development

REM Start the React dev server
echo Starting React Development Server on port 3000...
echo.

cd /d "%DIR%"
call npm start

pause
