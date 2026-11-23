
# config/settings/local.py

from .base import *

SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env.bool("DJANGO_DEBUG", default=False)

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'backend',
]

# Database
DATABASES = {
    'default': env.db("DATABASE_URL")
}

# Email
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
