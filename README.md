# Стимул быть здоровым

Веб-приложение для отслеживания физической активности и постановки целей в области здоровья.  
Реализовано с использованием React (фронтенд) и Django (бэкенд).

## Технологии

- **Frontend**: React, Vite, styled-components, React Router, Recharts, Leaflet, Axios
- **Backend**: Django, Django REST Framework, SimpleJWT, SQLite

## Требования

- Node.js (версия 18 или выше)
- Python (версия 3.10 или выше)
- pip и virtualenv 

## Запуск проекта

### 1. Клонирование репозитория

```bash
git clone https://github.com/SATORYYYYY/stimul.git
cd (название папки (без скобок))

### 2. BACKEND

cd backend
python -m venv venv
venv\Scripts\activate   

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### 3. Настройка фронтенда 

cd frontend
npm install
npm run dev