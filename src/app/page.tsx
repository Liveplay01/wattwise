"use client";

import { useState, useCallback, useEffect } from "react";
import MapView from "@/components/map/MapView";
import TopBar from "@/components/navigation/TopBar";
import AddressSearch from "@/components/search/AddressSearch";
import AnalysisDrawer from "@/components/analysis/AnalysisDrawer";
import DemoBanner from "@/components/DemoBanner";
import HintOverlay from "@/components/HintOverlay";
import TutorialOnboarding from "@/components/TutorialOnboarding";
import PreferencesModal from "@/components/PreferencesModal";
import FeedbackBanner from "@/components/FeedbackBanner";
import SplashCursor from "@/components/ui/SplashCursor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEnergyAnalysis } from "@/hooks/useEnergyAnalysis";
import { useMapLocation } from "@/hooks/useMapLocation";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useTheme } from "@/hooks/useTheme";
import { isInGermany } from "@/lib/utils";
import type { UserPreferences } from "@/lib/energy/types";

export default function Home() {
  const { location, selectLocation } = useMapLocation();
  const { preferences, setPreferences, skipForever, setSkipForever } = useUserPreferences();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Pending location — committed after prefs confirmed in drawer
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [showPrefsInDrawer, setShowPrefsInDrawer] = useState(false);
  // Standalone prefs modal — only for TopBar "edit prefs" button
  const [prefsModalOpen, setPrefsModalOpen] = useState(false);

  const { data, isLoading, error } = useEnergyAnalysis(location, preferences);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number, address?: string) => {
      if (!isInGermany(lat, lng)) return;
      if (skipForever) {
        const success = selectLocation(lat, lng, address);
        if (success) setDrawerOpen(true);
      } else {
        setPendingLocation({ lat, lng, address });
        setShowPrefsInDrawer(true);
        setDrawerOpen(true);
      }
    },
    [skipForever, selectLocation]
  );

  // Called from AnalysisDrawer preferences step (map-click flow)
  const handleDrawerPrefsConfirm = useCallback(
    (prefs: UserPreferences, forever: boolean) => {
      setPreferences(prefs);
      if (forever) setSkipForever(true);
      setShowPrefsInDrawer(false);
      if (pendingLocation) {
        selectLocation(pendingLocation.lat, pendingLocation.lng, pendingLocation.address);
        setPendingLocation(null);
      }
    },
    [pendingLocation, setPreferences, setSkipForever, selectLocation]
  );

  const handleDrawerPrefsSkip = useCallback(() => {
    setShowPrefsInDrawer(false);
    if (pendingLocation) {
      selectLocation(pendingLocation.lat, pendingLocation.lng, pendingLocation.address);
      setPendingLocation(null);
    }
  }, [pendingLocation, selectLocation]);

  // Called from TopBar standalone preferences modal
  const handlePrefsConfirm = useCallback(
    (prefs: UserPreferences, forever: boolean) => {
      setPreferences(prefs);
      if (forever) setSkipForever(true);
      setPrefsModalOpen(false);
      if (location) setDrawerOpen(true);
    },
    [location, setPreferences, setSkipForever]
  );

  const handlePrefsSkip = useCallback(() => {
    setPrefsModalOpen(false);
  }, []);

  const handleOpenPreferences = useCallback(() => {
    setPrefsModalOpen(true);
  }, []);

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    setDrawerOpen(open);
    if (!open && showPrefsInDrawer) {
      setShowPrefsInDrawer(false);
      setPendingLocation(null);
    }
  }, [showPrefsInDrawer]);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      handleLocationSelect(lat, lng);
    },
    [handleLocationSelect]
  );

  const handleAddressSelect = useCallback(
    (lat: number, lng: number, address: string) => {
      handleLocationSelect(lat, lng, address);
    },
    [handleLocationSelect]
  );

  const handleInvalidClick = useCallback((msg: string) => {
    setInvalidMsg(msg);
    setTimeout(() => setInvalidMsg(null), 3000);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Fluid cursor effect — desktop only */}
      {!isTouchDevice && (
        <SplashCursor
          COLORS={['#22d3ee', '#4ade80', '#facc15']}
          DENSITY_DISSIPATION={5}
          SPLAT_RADIUS={0.15}
          SPLAT_FORCE={4000}
        />
      )}

      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapView
          onLocationSelect={handleMapClick}
          onInvalidClick={handleInvalidClick}
          selectedLat={location?.lat}
          selectedLng={location?.lng}
          theme={theme}
        />
      </div>

      {/* Top bar with logo + WDG badge + tutorial */}
      <TopBar theme={theme} toggleTheme={toggleTheme} onOpenPreferences={handleOpenPreferences} onSideDrawerChange={setSideDrawerOpen} />

      {/* Demo banner + search stacked, unterhalb TopBar */}
      <div className="absolute top-[4.5rem] left-0 right-0 z-[1000] px-4 flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-full max-w-lg pointer-events-auto">
          <DemoBanner />
        </div>
        <div className="w-full max-w-lg pointer-events-auto">
          <AddressSearch onSelect={handleAddressSelect} />
        </div>
      </div>

      {/* Ungültiger Klick – Alert */}
      {invalidMsg && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] pointer-events-none max-w-xs w-full">
          <Alert variant="destructive" className="bg-card/95 backdrop-blur-md shadow-xl text-center">
            <AlertDescription>{invalidMsg}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hint when no location selected */}
      {!location && <HintOverlay />}

      {/* Footer */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
        <p className="text-[10px] text-muted-foreground/50 whitespace-nowrap">
          Ein Schulprojekt des Wilhelm-Dörpfeld-Gymnasiums Wuppertal
        </p>
      </div>

      {/* First-time user tutorial */}
      <TutorialOnboarding />

      {/* Feedback banner (bottom-right) */}
      <FeedbackBanner drawerOpen={drawerOpen || sideDrawerOpen} />

      {/* Pre-analysis preferences modal */}
      <PreferencesModal
        open={prefsModalOpen}
        initialPreferences={preferences}
        onConfirm={handlePrefsConfirm}
        onSkip={handlePrefsSkip}
      />

      {/* Analysis Drawer */}
      <AnalysisDrawer
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
        isLoading={isLoading}
        data={data}
        error={error}
        showPreferences={showPrefsInDrawer}
        initialPreferences={preferences}
        onPrefsConfirm={handleDrawerPrefsConfirm}
        onPrefsSkip={handleDrawerPrefsSkip}
      />
    </main>
  );
}
