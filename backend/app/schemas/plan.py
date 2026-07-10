from pydantic import BaseModel, Field


class PlanRequest(BaseModel):
    city: str = Field(..., min_length=1, description="Nom de la ville à planifier")


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
