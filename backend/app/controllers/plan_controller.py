from fastapi import HTTPException
from app.services.weather_service import get_weather
from app.services.activities_service import get_activities

async def plan_trip(city: str):
    try:
        temp, desc = await get_weather(city)
        acts = await get_activities(city)
    except Exception as e:
        raise HTTPException(502, f"Erreur externe : {str(e)}")

    return temp, desc, acts
