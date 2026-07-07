@echo off
setlocal

:: Get the full path to index.html in this folder
set "APP_PATH=%~dp0index.html"

:: Convert backslashes to forward slashes for file:/// URL
set "APP_URL=file:///%APP_PATH:\=/%"

:: Try Microsoft Edge first (present on all Windows 10/11 machines)
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

if exist "%EDGE%" (
    start "" "%EDGE%" --app="%APP_URL%" --window-size=1200,800
    exit /b
)

:: Try Google Chrome
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if exist "%CHROME%" (
    start "" "%CHROME%" --app="%APP_URL%" --window-size=1200,800
    exit /b
)

:: Fallback: open in default browser
echo No Edge or Chrome found. Opening in default browser...
start "" "%APP_PATH%"
