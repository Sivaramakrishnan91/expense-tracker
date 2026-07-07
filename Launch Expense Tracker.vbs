' Silent launcher — runs the .bat without showing a command-prompt window
Set oShell = CreateObject("WScript.Shell")
Dim strDir
strDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
oShell.Run """" & strDir & "Launch Expense Tracker.bat""", 0, False
