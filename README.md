# Neighbourhood Pickup Service

This repository contains a minimal FastAPI application that models key pieces of a neighbourhood pickup service. Senders can build grocery carts and find nearby receivers who can deliver them.

## Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 --app-dir src
```

Once running, open `http://localhost:8000/` in a browser to use the simple HTML frontend for adding cart items and browsing nearby receivers.

## Running Tests

```bash
PYTHONPATH=src pytest
```
