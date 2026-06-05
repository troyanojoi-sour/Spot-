@echo off
setlocal
set "PNPM_CMD=%APPDATA%\npm\pnpm.cmd"
set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
set "PNPM_MJS=%APPDATA%\npm\node_modules\pnpm\bin\pnpm.mjs"

if exist "%PNPM_CMD%" (
  "%PNPM_CMD%" install
  exit /b %errorlevel%
)

if exist "%NODE_EXE%" if exist "%PNPM_MJS%" (
  "%NODE_EXE%" "%PNPM_MJS%" install
  exit /b %errorlevel%
)

echo No se encontró pnpm.cmd ni pnpm.mjs.
echo Asegúrate de tener Node.js y pnpm instalados.
exit /b 1
