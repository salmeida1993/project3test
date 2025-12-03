export async function geoLookup(query) {
  try {
    const token = process.env.MAPBOX_PUBLIC_TOKEN;
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&limit=1`;

    const res = await fetch(endpoint);
    if (!res.ok) return null;

    const data = await res.json();
    const feature = data.features?.[0];

    if (!feature) return null;

    return {
      lng: feature.center[0],
      lat: feature.center[1],
    };
  } catch (err) {
    console.error("Geo lookup error:", err);
    return null;
  }
}
