from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict
from pathlib import Path
import math

app = FastAPI()

static_dir = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
def index():
    return FileResponse(static_dir / "index.html")


class CartItem(BaseModel):
    name: str
    quantity: int


class Receiver(BaseModel):
    id: str
    lat: float
    lon: float


# In-memory stores
carts: Dict[str, List[CartItem]] = {}
receivers: Dict[str, Receiver] = {}


@app.post("/senders/{sender_id}/cart/items", response_model=List[CartItem])
def add_item(sender_id: str, item: CartItem):
    """Add an item to a sender's cart."""
    cart = carts.setdefault(sender_id, [])
    cart.append(item)
    return cart


@app.get("/senders/{sender_id}/cart", response_model=List[CartItem])
def get_cart(sender_id: str):
    """Retrieve all items in a sender's cart."""
    return carts.get(sender_id, [])


@app.post("/receivers", response_model=Receiver)
def register_receiver(receiver: Receiver):
    """Register a receiver with their location."""
    receivers[receiver.id] = receiver
    return receiver


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on Earth."""
    R = 6371  # Earth radius in kilometers
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


@app.get("/receivers/nearby", response_model=List[Receiver])
def nearby_receivers(lat: float, lon: float, radius_km: float):
    """List receivers within `radius_km` of the given coordinates."""
    result = []
    for receiver in receivers.values():
        distance = haversine(lat, lon, receiver.lat, receiver.lon)
        if distance <= radius_km:
            result.append(receiver)
    return result
