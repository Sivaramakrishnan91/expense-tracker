' Silent launcher — runs the .bat without showing a command-prompt window
Set oShell = CreateObject("WScript.Shell")
Dim strDir
strDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
oShell.Run """" & strDir & "Launch Personal Finance Tracker.bat""", 0, False
