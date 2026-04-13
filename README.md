# Wattwise ⚡

> **Ein Schulprojekt der WDG Schule Wuppertal** | Demo-Anwendung

Wattwise ist eine Karten-App, die dir zeigt, ob du auf deinem Grundstück besser eine **Solaranlage ☀️**, ein **Windrad 🌬️** oder ein **Wasserrad 💧** bauen solltest — auf Basis echter, öffentlicher Daten.

## Features

- Interaktive Deutschlandkarte (OpenStreetMap, CartoDB Dark)
- Adresssuche mit Autocomplete (Nominatim)
- Echtzeit-Analyse mit echten APIs:
  - **Open-Meteo API** → Sonneneinstrahlung + Windgeschwindigkeit
  - **OpenStreetMap Overpass API** → Gewässer im Umkreis
  - **Open-Meteo Elevation API** → Höhenlage
- Klare Empfehlung mit Begründung auf Deutsch
- Nur für Deutschland verfügbar

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui (Skeleton, Drawer, Breadcrumb)
- **react-leaflet** für die Karte
- **TanStack Query** für Datenabruf
- Deployment auf **Vercel**

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Deployment

Das Projekt ist auf Vercel deployed. Jeder Push auf `main` löst automatisch ein neues Deployment aus.

## Disclaimer

Dies ist eine Demo-Anwendung im Rahmen eines Schulprojekts. Alle Empfehlungen dienen nur zu Informationszwecken und sind kein Ersatz für eine professionelle Energieberatung.

---

*WDG Schule Wuppertal · Schulprojekt 2026*
