#!/usr/bin/env bash
# Build script for Render (run from the backend/ directory).
set -o errexit

pip install -r requirements.txt

# Apply committed migrations.
python manage.py migrate --no-input

# Collect static files for WhiteNoise to serve (used by the Django admin).
python manage.py collectstatic --no-input
