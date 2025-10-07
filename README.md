# FastAPI + React + PostgreSQL Template

A full-stack application template using FastAPI (backend), React (frontend), and PostgreSQL (database) with Docker support.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Database Migrations](#database-migrations)
- [Development Workflow](#development-workflow)

## 🛠 Tech Stack

**Backend:**
- Python 3.13+
- FastAPI (with standard dependencies including uvicorn)
- SQLModel (ORM)
- Alembic (database migrations)
- PostgreSQL driver (psycopg2-binary)
- python-dotenv (environment variables)

**Frontend:**
- React 19.1.1
- Vite 7.1.2 (build tool)
- ESLint (code quality)

**Database & Tools:**
- PostgreSQL
- pgAdmin 4 (database management UI)
- Docker & Docker Compose

## 📁 Project Structure

```
.
├── backend/
│   ├── alembic/              # Database migration files
│   │   ├── versions/         # Migration versions
│   │   ├── env.py
│   │   ├── README
│   │   └── script.py.mako
│   ├── routes/               # API route modules
│   │   └── __init__.py
│   ├── __init__.py
│   ├── alembic.ini           # Alembic configuration
│   ├── db.py                 # Database connection
│   ├── main.py               # FastAPI application
│   ├── models.py             # SQLModel models
│   ├── pyproject.toml        # Python dependencies
│   └── uv.lock               # Dependency lock file
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # React assets
│   │   ├── App.css
│   │   ├── App.jsx           # Main React component
│   │   ├── index.css
│   │   └── main.jsx          # React entry point
│   ├── eslint.config.js      # ESLint configuration
│   ├── index.html            # HTML template
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
├── .env                      # Environment variables
├── .gitignore
├── docker-compose.yml        # Docker services configuration
├── pgadmin-servers.json      # pgAdmin auto-connection config
└── README.md
```

## ✅ Prerequisites

- **Python 3.13+** - Install via uv (recommended) or [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - Install via nvm (recommended) or [Download Node.js](https://nodejs.org/)
- **Docker & Docker Compose** - [Install Docker](https://docs.docker.com/get-docker/)
- **uv** (Python package manager) - [Install uv](https://github.com/astral-sh/uv)

### Installing Python with uv

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Python 3.13
uv python install 3.13
```

### Installing Node.js with nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc for zsh

# Install Node.js LTS
nvm install --lts

# Use the installed version
nvm use --lts
```

> **Note:** Using uv for Python management and nvm for Node.js version management is recommended as they allow easy switching between different versions and provide better dependency isolation.

## 🚀 Setup Instructions

Follow these steps to create the template from scratch:

### Step 1: Initialize Project Structure

```bash
# Create project directory
mkdir fastapi_react_postgres_template
cd fastapi_react_postgres_template

# Create backend and frontend directories
mkdir backend frontend
```

### Step 2: Setup Backend

```bash
cd backend

# Initialize Python project with uv
uv init --python 3.13

# Add dependencies
uv add fastapi[standard] sqlmodel alembic psycopg2-binary python-dotenv

# Create necessary files
touch __init__.py models.py db.py

# Initialize Alembic for database migrations
uv run alembic init alembic

# Create routes directory
mkdir routes
touch routes/__init__.py
```

**Create `backend/main.py`:**

Reference: [CORS middleware](https://fastapi.tiangolo.com/tutorial/cors/#use-corsmiddleware)

```python
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"success": True}
```

**Create `backend/db.py`:**

```python
import os
from dotenv import load_dotenv
from sqlmodel import create_engine

load_dotenv()

db_name = os.getenv("POSTGRES_DB")
db_user = os.getenv("POSTGRES_USER")
db_password = os.getenv("POSTGRES_PASSWORD")
db_host = os.getenv("POSTGRES_HOST", "localhost")
db_port = os.getenv("POSTGRES_PORT", "5432")
db_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

engine = create_engine(db_url)
```

**Create `backend/models.py`:**

```python
# Define your SQLModel models here
# Example:
# from sqlmodel import SQLModel, Field
# 
# class User(SQLModel, table=True):
#     id: int | None = Field(default=None, primary_key=True)
#     name: str
#     email: str
```

### Step 3: Setup Frontend

```bash
cd ../frontend

# Create React app with Vite
# this will guide the setup (eg React, Typescript + SWC)
npm create vite@latest .

# Install dependencies
npm install
```

### Step 4: Setup Docker Services

**Create `docker-compose.yml`** in the project root:

```yaml
services:
  db:
    image: postgres
    restart: always
    env_file:
      - .env
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - 5432:5432

  pgadmin:
    image: dpage/pgadmin4
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: your-email@example.com
      PGADMIN_DEFAULT_PASSWORD: demopassword
      PGADMIN_CONFIG_SERVER_MODE: 'False' # disable login
      PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED: 'False' # disable master password
    ports:
      - "5433:80"
    volumes:
      - pgadmin-data:/var/lib/pgadmin
      - ./pgadmin-servers.json:/pgadmin4/servers.json
    depends_on:
      - db

volumes:
  pgdata:
  pgadmin-data:
```

**Create `.env`** in the project root:

```env
POSTGRES_DB=myapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=demopassword
```

**Create `pgadmin-servers.json`** in the project root:

```json
{
  "Servers": {
    "1": {
      "Name": "Local PostgreSQL",
      "Group": "Servers",
      "Host": "db",
      "Port": 5432,
      "MaintenanceDB": "postgres",
      "Username": "postgres",
      "Password": "demopassword",
      "SSLMode": "prefer"
    }
  }
}
```

**Create `.gitignore`** in the project root:

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
.env
.venv/
venv/
*.egg-info/

# Node
node_modules/
dist/
*.log

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### Step 5: Configure Alembic

**Update `backend/alembic/env.py`** to use your database URL:

```python
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import sys
from pathlib import Path

# Add parent directory to path to import models
sys.path.append(str(Path(__file__).resolve().parents[1]))

from db import db_url
from models import *  # Import all models
from sqlmodel import SQLModel

config = context.config

# Override sqlalchemy.url from alembic.ini with the one from db.py
config.set_main_option("sqlalchemy.url", db_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

## 🎮 Usage

### 1. Start Docker Services

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Check if services are running
docker-compose ps
```

Access pgAdmin at: http://localhost:5433

### 2. Start Backend Server

```bash
cd backend

# Run FastAPI development server
uv run fastapi dev main.py
```

Backend API will be available at: http://localhost:8000
- API docs (Swagger): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc

### 3. Start Frontend Development Server

```bash
cd frontend

# Run Vite development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## 🗄 Database Migrations

### Create a New Migration

```bash
cd backend

# Create a new migration after modifying models.py
uv run alembic revision --autogenerate -m "description of changes"
```

### Apply Migrations

```bash
# Apply all pending migrations
uv run alembic upgrade head

# Rollback one migration
uv run alembic downgrade -1

# View migration history
uv run alembic history
```

## 💻 Development Workflow

### Adding a New API Endpoint

1. Define model in `backend/models.py`
2. Create migration: `uv run alembic revision --autogenerate -m "add model"`
3. Apply migration: `uv run alembic upgrade head`
4. Create route in `backend/routes/`
5. Register route in `backend/main.py`

### Frontend Development

1. Components go in `frontend/src/`
2. API calls should use the backend URL: `http://localhost:8000`
3. Build for production: `npm run build`

### Environment Variables

- Backend: Modify `.env` file
- Frontend: Use `VITE_` prefix for Vite env variables