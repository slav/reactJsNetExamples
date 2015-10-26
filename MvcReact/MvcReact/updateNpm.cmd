@echo off
setlocal

cmd npm-check-updates

:PROMPT
SET /P AREYOUSURE=Install updates (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END

npm-check-updates -u
npm update

:END
endlocal
pause