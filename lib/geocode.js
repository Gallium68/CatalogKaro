// Free geocoding using OpenStreetMap's Nominatim service.
// No API key, no credit card, no usage cost - just a fair-use rate limit
// (max ~1 request/second), which is fine for our use case since we only
// geocode once, when a business owner saves their address.
export async function geocodeAddress(address) {
  if (!address || address.trim().length < 4) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    address
  )}`;

  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim's usage policy asks for a way to identify the app
        "Accept-Language": "en",
      },
    });
    const data = await res.json();
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch (err) {
    console.error("Geocoding failed:", err);
    return null;
  }
}
