@echo off
echo ============================================
echo  Wattwise - Git Setup
echo  WDG Schule Wuppertal
echo ============================================
echo.
echo Initialisiere Git-Repository...
git init
git branch -M main

echo.
echo Alle Dateien hinzufuegen...
git add .
git commit -m "Initial commit: Wattwise Website

Schulprojekt WDG Schule Wuppertal
- Next.js 14 App Router + TypeScript
- Dark emerald theme (Supabase-inspired)
- Interaktive Deutschlandkarte (Leaflet)
- Echte Daten: Open-Meteo API + Overpass API
- Skeleton, Drawer, Breadcrumb (shadcn/ui)"

echo.
echo Verbinde mit GitHub...
echo Bitte erstelle zuerst das Repository auf github.com/Liveplay01/wattwise
echo Dann druecke eine Taste zum Fortfahren...
pause

git remote add origin https://github.com/Liveplay01/wattwise.git
git push -u origin main

echo.
echo Fertig! Jetzt kannst du die Seite auf Vercel deployen:
echo https://vercel.com/new - GitHub Repository importieren
echo.
pause
