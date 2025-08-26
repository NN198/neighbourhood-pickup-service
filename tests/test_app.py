from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_add_and_get_cart():
    response = client.post("/shoppers/s1/cart/items", json={"name": "apple", "quantity": 2})
    assert response.status_code == 200
    response = client.get("/shoppers/s1/cart")
    assert response.json() == [{"name": "apple", "quantity": 2}]


def test_nearby_helpers():
    client.post("/helpers", json={"id": "h1", "lat": 10.0, "lon": 10.0})
    client.post("/helpers", json={"id": "h2", "lat": 50.0, "lon": 50.0})
    response = client.get("/helpers/nearby", params={"lat": 10.1, "lon": 10.1, "radius_km": 20})
    data = {r["id"] for r in response.json()}
    assert "h1" in data
    assert "h2" not in data


def test_seed_endpoint_populates_data():
    client.post("/seed")
    cart_resp = client.get("/shoppers/alice/cart")
    assert {item["name"] for item in cart_resp.json()} == {"milk", "bread"}

    helpers_resp = client.get("/helpers")
    ids = {h["id"] for h in helpers_resp.json()}
    assert {"bob", "charlie"} <= ids


def test_index_page_served():
    response = client.get("/")
    assert response.status_code == 200
    assert "Neighborhood Pickup" in response.text
