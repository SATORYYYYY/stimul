#!/usr/bin/env bash
# Build script for Render (run from the backend/ directory).
set -o errexit

pip install -r requirements.txt

# Generate migrations for the project apps (migrations are not committed) and apply them.
python manage.py makemigrations users activities goals daily_challenges
python manage.py migrate

# Collect static files for WhiteNoise to serve (used by the Django admin).
python manage.py collectstatic --no-input
