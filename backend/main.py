from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from app.core.database import Base, engine
from app.routes.auth_routes import router as auth_router
from app.routes.plan_routes import router as plan_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trip Planner API")


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )
    openapi_schema.setdefault("components", {}).setdefault("securitySchemes", {})["bearerAuth"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
    }
    openapi_schema["security"] = [{"bearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
app.include_router(auth_router)
app.include_router(plan_router)
