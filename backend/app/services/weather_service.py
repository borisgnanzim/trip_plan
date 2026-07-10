import httpx
from app.core.config import settings

OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"

async def get_weather(city: str):
    params = {"q": city, "appid": settings.OPENWEATHER_API_KEY, "units": "metric", "lang": "fr"}

    async with httpx.AsyncClient() as client:
        response = await client.get(OPENWEATHER_API_URL, params=params)

    if response.status_code != 200:
        raise RuntimeError("Erreur API météo")

    data = response.json()
    main_data = data.get("main")
    weather_data = data.get("weather")

    if not main_data or not weather_data:
        raise RuntimeError("Réponse invalide de l'API météo")

    temp = main_data.get("temp")
    description = weather_data[0].get("description")
    return temp, description
