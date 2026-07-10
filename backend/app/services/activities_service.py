import httpx
from app.core.config import settings

OPENTRIPMAP_API_URL = "https://api.opentripmap.com/0.1/en/places"

async def get_activities(city: str):
    async with httpx.AsyncClient() as client:
        # 1. Get city coordinates
        geo_url = f"{OPENTRIPMAP_API_URL}/geoname"
        geo_params = {"name": city, "apikey": settings.OPENTRIPMAP_API_KEY}
        geo_response = await client.get(geo_url, params=geo_params)

        if geo_response.status_code != 200:
            raise RuntimeError(f"Ville '{city}' introuvable.")

        geo_data = geo_response.json()
        lat = geo_data.get("lat")
        lon = geo_data.get("lon")

        if lat is None or lon is None:
            raise RuntimeError(f"Coordonnées introuvables pour la ville '{city}'.")

        # 2. Get points of interest (POIs) near the city
        poi_url = f"{OPENTRIPMAP_API_URL}/radius"
        poi_params = {
            "radius": 3000,
            "lon": lon,
            "lat": lat,
            "limit": 3,
            "apikey": settings.OPENTRIPMAP_API_KEY
        }
        pois_response = await client.get(poi_url, params=poi_params)

        if pois_response.status_code != 200:
            raise RuntimeError("Erreur lors de la récupération des activités via l'API.")

        pois_data = pois_response.json()
        results = []
        for feature in pois_data.get("features", []):
            properties = feature.get("properties", {})
            if properties.get("name"): # Only add activities with a name
                results.append({
                    "name": properties.get("name"),
                    "category": properties.get("kinds", "inconnue")
                })

        return results
