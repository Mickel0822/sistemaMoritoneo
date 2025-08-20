"""
Django settings for monitoreo project.
Listo para Render: usa SQLite por defecto y variables de entorno para producción.
"""

from pathlib import Path
import os

# =========================
# Paths
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# Seguridad y modo
# =========================
SECRET_KEY = os.environ.get("SECRET_KEY", "change-me")  # cámbialo en Render
DEBUG = os.environ.get("DEBUG", "False").lower() == "true"

# ALLOWED_HOSTS: en Render puedes iniciar con "*" y luego restringir a tu dominio
ALLOWED_HOSTS = [h for h in os.environ.get("ALLOWED_HOSTS", "*").split(",") if h]

# Cuando estás detrás de proxy (Render) esto ayuda a detectar HTTPS real
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# =========================
# Apps
# =========================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Terceros
    "rest_framework",
    "corsheaders",

    # Apps propias
    "api",
]

# =========================
# Middleware
# =========================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # debe ir alto en la lista
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# =========================
# CORS / CSRF
# =========================
# Si publicas el front como Static Site en Render con rewrite a /api, puedes
# dejar estos valores relajados. Luego restríngelos con tus dominios reales.
CORS_ALLOW_ALL_ORIGINS = os.environ.get("CORS_ALLOW_ALL_ORIGINS", "True").lower() == "true"

# Si NO permites todo, especifica explícitamente orígenes (coma-separados)
CORS_ALLOWED_ORIGINS = [
    o for o in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",") if o
]

# Para formularios/CSRF si llamas desde otro dominio HTTPS
CSRF_TRUSTED_ORIGINS = [
    o for o in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",") if o
]

# =========================
# URLS / Templates / WSGI
# =========================
ROOT_URLCONF = "monitoreo.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "monitoreo.wsgi.application"

# =========================
# Base de datos
# - SQLite por defecto (no persistente en Render, pero tu API no guarda datos)
# - Si defines DATABASE_URL y tienes dj_database_url instalado, usa esa DB.
# =========================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    try:
        import dj_database_url  # instalar si en algún momento migras a Postgres
        DATABASES["default"] = dj_database_url.config(
            default=DATABASE_URL, conn_max_age=600
        )
    except ImportError:
        # Si no está instalado, sigue con SQLite sin romper
        pass

# =========================
# Password validators
# =========================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# =========================
# Internacionalización
# =========================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# =========================
# Archivos estáticos
# =========================
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# =========================
# Primary key por defecto
# =========================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
