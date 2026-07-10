from pydantic import BaseModel

class PlanRequest(BaseModel):
    city: str

class WeatherInfo(BaseModel):
    temperature: float
    description: str

class Activity(BaseModel):
    name: str
    category: str

class PlanResponse(BaseModel):
    city: str
    weather: WeatherInfo
    activities: list[Activity]
