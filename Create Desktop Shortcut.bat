@echo off
setlocal

:: Path to the .vbs launcher in this folder
set "VBS_PATH=%~dp0Launch Personal Finance Tracker.vbs"
set "SHORTCUT=%USERPROFILE%\Desktop\Personal Finance Tracker.lnk"

:: Use PowerShell to create the shortcut
powershell -NoProfile -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $sc = $ws.CreateShortcut('%SHORTCUT%'); ^
   $sc.TargetPath = '%VBS_PATH%'; ^
   $sc.Description = 'Personal Finance Tracker'; ^
   $sc.Save()"

echo.
echo Desktop shortcut created: %SHORTCUT%
echo You can now double-click "Personal Finance Tracker" on your desktop.
pause
