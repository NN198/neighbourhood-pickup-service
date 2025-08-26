from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict
from pathlib import Path
from pydantic import BaseModel
from typing import List, Dict


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



class Helper(BaseModel):
  
class Receiver(BaseModel):
    id: str
    lat: float
    lon: float


# In-memory stores
carts: Dict[str, List[CartItem]] = {}
helpers: Dict[str, Helper] = {}


@app.post("/shoppers/{shopper_id}/cart/items", response_model=List[CartItem])
def add_item(shopper_id: str, item: CartItem):
    """Add an item to a shopper's cart."""
    cart = carts.setdefault(shopper_id, [])
    
receivers: Dict[str, Receiver] = {}


@app.post("/senders/{sender_id}/cart/items", response_model=List[CartItem])
def add_item(sender_id: str, item: CartItem):
    """Add an item to a sender's cart."""
    cart = carts.setdefault(sender_id, [])
    cart.append(item)
    return cart



@app.get("/shoppers/{shopper_id}/cart", response_model=List[CartItem])
def get_cart(shopper_id: str):
    """Retrieve all items in a shopper's cart."""
    return carts.get(shopper_id, [])


@app.post("/helpers", response_model=Helper)
def register_helper(helper: Helper):
    """Register a helper with their location."""
    helpers[helper.id] = helper
    return helper

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



@app.get("/helpers", response_model=List[Helper])
def list_helpers():
    """Return all registered helpers."""
    return list(helpers.values())


@app.get("/helpers/nearby", response_model=List[Helper])
def nearby_helpers(lat: float, lon: float, radius_km: float):
    """List helpers within `radius_km` of the given coordinates."""
    result = []
    for helper in helpers.values():
        distance = haversine(lat, lon, helper.lat, helper.lon)
        if distance <= radius_km:
            result.append(helper)
    return result


@app.post("/seed")
def seed_data():
    """Populate the in-memory store with dummy shoppers and helpers."""
    carts.clear()
    helpers.clear()

    carts["alice"] = [CartItem(name="milk", quantity=2), CartItem(name="bread", quantity=1)]

    helpers["bob"] = Helper(id="bob", lat=37.7749, lon=-122.4194)
    helpers["charlie"] = Helper(id="charlie", lat=37.8044, lon=-122.2711)

    return {"shoppers": list(carts.keys()), "helpers": list(helpers.keys())}

@app.get("/receivers/nearby", response_model=List[Receiver])
def nearby_receivers(lat: float, lon: float, radius_km: float):
    """List receivers within `radius_km` of the given coordinates."""
    result = []
    for receiver in receivers.values():
        distance = haversine(lat, lon, receiver.lat, receiver.lon)
        if distance <= radius_km:
            result.append(receiver)
    return result
