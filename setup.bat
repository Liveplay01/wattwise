@echo off
echo ============================================
echo  Wattwise - Setup & Start
echo  WDG Schule Wuppertal
echo ============================================
echo.
echo Installiere Abhaengigkeiten...
call npm install
if errorlevel 1 (
  echo FEHLER: npm install fehlgeschlagen
  pause
  exit /b 1
)
echo.
echo Starte Entwicklungsserver...
echo Oeffne http://localhost:3000 im Browser
echo.
call npm run dev
pause
