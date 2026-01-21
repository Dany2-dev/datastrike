from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.db.session import engine
from app.db.base import Base
from app.api.router import router
from app.core.config import FRONTEND_URL, SECRET_KEY, ENV

# 🔹 IMPORTAR ROUTER AUTH (/auth/me)
from auth.routes import router as auth_router

# Importar modelos
from app.models.equipo import Equipo
from app.models.jugador import Jugador
from app.models.user import User
from app.models.user_file import UserFile

app = FastAPI(title="DataStrike API")

# 🔹 CORS (LOCAL + VERCEL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://datastrike-nu.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 SESSION / COOKIES (Google OAuth)
app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY,
    same_site="none",     # 🔴 CLAVE para OAuth
    https_only=True       # 🔴 CLAVE en producción
)

# 🔹 Crear tablas solo en dev
if ENV == "dev":
    @app.on_event("startup")
    def startup():
        Base.metadata.create_all(bind=engine)

# 🔹 ROUTERS
app.include_router(router)        # API general
app.include_router(auth_router)   # /auth/me

@app.get("/")
def root():
    return {"status": "ok"}
