#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
# Si algún día usas estáticos de Django:
python manage.py collectstatic --noinput || true
python manage.py migrate
