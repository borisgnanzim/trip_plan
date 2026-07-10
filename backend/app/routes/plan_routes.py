from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.schemas.plan import Activity, PlanRequest, PlanResponse, WeatherInfo
from app.core.security import decode_token
from app.controllers.plan_controller import plan_trip

security_scheme = HTTPBearer(auto_error=False)
router = APIRouter()


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Token invalide")

    token = credentials.credentials
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide")
    return user_id


@router.post("/plan", response_model=PlanResponse)
async def plan(payload: PlanRequest, user=Depends(get_current_user)):
    temp, desc, acts = await plan_trip(payload.city)
    return PlanResponse(
        city=payload.city,
        weather=WeatherInfo(temperature=temp, description=desc),
        activities=[Activity(**a) for a in acts]
    )
