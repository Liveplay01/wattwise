export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  address?: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export async function geocodeAddress(query: string): Promise<NominatimResult[]> {
  if (!query.trim() || query.length < 3) return [];

  const params = new URLSearchParams({
    q: query,
    countrycodes: "de",
    format: "json",
    limit: "5",
    addressdetails: "1",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        "User-Agent": "Wattwise/1.0 (Schulprojekt WDG Wuppertal; kontakt@wdg-wuppertal.de)",
        "Accept-Language": "de",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Geocoding-Fehler: ${response.status}`);
  }

  return response.json();
}

export function formatDisplayName(result: NominatimResult): string {
  if (!result.address) return result.display_name;
  const { road, city, town, village, postcode, state } = result.address;
  const locality = city || town || village;
  const parts = [road, locality ? `${postcode ? postcode + " " : ""}${locality}` : null, state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : result.display_name;
}
