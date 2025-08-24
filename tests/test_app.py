from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_add_and_get_cart():
    response = client.post("/senders/s1/cart/items", json={"name": "apple", "quantity": 2})
    assert response.status_code == 200
    response = client.get("/senders/s1/cart")
    assert response.json() == [{"name": "apple", "quantity": 2}]


def test_nearby_receivers():
    client.post("/receivers", json={"id": "r1", "lat": 10.0, "lon": 10.0})
    client.post("/receivers", json={"id": "r2", "lat": 50.0, "lon": 50.0})
    response = client.get("/receivers/nearby", params={"lat": 10.1, "lon": 10.1, "radius_km": 20})
    data = {r["id"] for r in response.json()}
    assert "r1" in data
    assert "r2" not in data
