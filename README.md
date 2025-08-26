# Neighbourhood Pickup Service

This repository contains a minimal FastAPI application that models key pieces of a neighbourhood pickup service. Shoppers can build grocery carts and find nearby helpers who can deliver them.

## Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 --app-dir src
```

Once running, open `http://localhost:8000/` in a browser to use the React-based frontend for adding cart items and browsing nearby helpers.

To populate some dummy shoppers and helpers, click **"Seed Dummy Data"** in the frontend or send a `POST /seed` request.

## Running Tests

```bash
PYTHONPATH=src pytest
```
