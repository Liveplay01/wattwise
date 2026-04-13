"use client";

import { useState, useCallback } from "react";
import MapView from "@/components/map/MapView";
import TopBar from "@/components/navigation/TopBar";
import AddressSearch from "@/components/search/AddressSearch";
import AnalysisDrawer from "@/components/analysis/AnalysisDrawer";
import DemoBanner from "@/components/DemoBanner";
import HintOverlay from "@/components/HintOverlay";
import { useEnergyAnalysis } from "@/hooks/useEnergyAnalysis";
import { useMapLocation } from "@/hooks/useMapLocation";

export default function Home() {
  const { location, selectLocation } = useMapLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState<string | null>(null);

  const { data, isLoading, error } = useEnergyAnalysis(location);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number, address?: string) => {
      const success = selectLocation(lat, lng, address);
      if (success) {
        setDrawerOpen(true);
      }
    },
    [selectLocation]
  );

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
    <main className="relative w-screen h-screen overflow-hidden bg-[#1c1c1c]">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapView
          onLocationSelect={handleMapClick}
          onInvalidClick={handleInvalidClick}
          selectedLat={location?.lat}
          selectedLng={location?.lng}
        />
      </div>

      {/* Top bar with logo + WDG badge + tutorial */}
      <TopBar />

      {/* Demo banner + search stacked, unterhalb TopBar */}
      <div className="absolute top-[4.5rem] left-0 right-0 z-[1000] px-4 flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-full max-w-lg pointer-events-auto">
          <DemoBanner />
        </div>
        <div className="w-full max-w-lg pointer-events-auto">
          <AddressSearch onSelect={handleAddressSelect} />
        </div>
      </div>

      {/* Ungültiger Klick – Toast */}
      {invalidMsg && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] pointer-events-none">
          <div className="rounded-xl border border-destructive/40 bg-card/95 backdrop-blur-md px-5 py-3 shadow-xl text-sm text-destructive text-center max-w-xs">
            {invalidMsg}
          </div>
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

      {/* Analysis Drawer */}
      <AnalysisDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        isLoading={isLoading}
        data={data}
        error={error}
      />
    </main>
  );
}
