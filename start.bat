@echo off
REM ============================================================
REM  Charity Events Hub - one-click launcher
REM  API : http://localhost:3000
REM  Web : http://localhost:5500
REM  Make sure the MySQL service "MySQL84" is running first.
REM ============================================================

setlocal
set "ROOT=%~dp0"

echo Starting Charity Events Hub...

start "Charity Events API" /D "%ROOT%api" cmd /k node server.js
start "Charity Events Web" /D "%ROOT%clientside" cmd /k npx.cmd --yes serve . -l 5500

echo.
echo  API : http://localhost:3000
echo  Web : http://localhost:5500
echo.
echo  Opening the website in your browser...
timeout /t 3 /nobreak >nul
start "" "http://localhost:5500"

endlocal
