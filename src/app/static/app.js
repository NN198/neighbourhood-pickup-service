const { useState } = React;

function App() {
  const [senderId, setSenderId] = useState('s1');
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [receiver, setReceiver] = useState({ id: '', lat: '', lon: '' });
  const [query, setQuery] = useState({ lat: '', lon: '', radius_km: 5 });
  const [nearby, setNearby] = useState([]);

  async function addItem() {
    await fetch(`/senders/${senderId}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: itemName, quantity: parseInt(itemQty) }),
    });
    loadCart();
  }

  async function loadCart() {
    const resp = await fetch(`/senders/${senderId}/cart`);
    const items = await resp.json();
    setCartItems(items);
  }

  async function registerReceiver() {
    await fetch('/receivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: receiver.id,
        lat: parseFloat(receiver.lat),
        lon: parseFloat(receiver.lon),
      }),
    });
  }

  async function findNearby() {
    const params = new URLSearchParams({
      lat: query.lat,
      lon: query.lon,
      radius_km: query.radius_km,
    });
    const resp = await fetch(`/receivers/nearby?${params.toString()}`);
    const recs = await resp.json();
    setNearby(recs);
  }

  return (
    React.createElement('div', null,
      React.createElement('h1', null, 'Neighborhood Pickup Service'),

      React.createElement('section', null,
        React.createElement('h2', null, 'Cart'),
        React.createElement('input', {
          value: senderId,
          onChange: e => setSenderId(e.target.value),
          placeholder: 'Sender ID'
        }),
        React.createElement('input', {
          value: itemName,
          onChange: e => setItemName(e.target.value),
          placeholder: 'Item name'
        }),
        React.createElement('input', {
          type: 'number',
          value: itemQty,
          onChange: e => setItemQty(e.target.value),
          placeholder: 'Qty'
        }),
        React.createElement('button', { onClick: addItem }, 'Add Item'),
        React.createElement('button', { onClick: loadCart }, 'Load Cart'),
        React.createElement('ul', null,
          cartItems.map((item, idx) =>
            React.createElement('li', { key: idx }, `${item.quantity} x ${item.name}`)
          )
        )
      ),

      React.createElement('section', null,
        React.createElement('h2', null, 'Register Receiver'),
        React.createElement('input', {
          value: receiver.id,
          onChange: e => setReceiver({ ...receiver, id: e.target.value }),
          placeholder: 'Receiver ID'
        }),
        React.createElement('input', {
          value: receiver.lat,
          onChange: e => setReceiver({ ...receiver, lat: e.target.value }),
          placeholder: 'Lat'
        }),
        React.createElement('input', {
          value: receiver.lon,
          onChange: e => setReceiver({ ...receiver, lon: e.target.value }),
          placeholder: 'Lon'
        }),
        React.createElement('button', { onClick: registerReceiver }, 'Register')
      ),

      React.createElement('section', null,
        React.createElement('h2', null, 'Nearby Receivers'),
        React.createElement('input', {
          value: query.lat,
          onChange: e => setQuery({ ...query, lat: e.target.value }),
          placeholder: 'Lat'
        }),
        React.createElement('input', {
          value: query.lon,
          onChange: e => setQuery({ ...query, lon: e.target.value }),
          placeholder: 'Lon'
        }),
        React.createElement('input', {
          value: query.radius_km,
          onChange: e => setQuery({ ...query, radius_km: e.target.value }),
          placeholder: 'Radius km'
        }),
        React.createElement('button', { onClick: findNearby }, 'Find'),
        React.createElement('ul', null,
          nearby.map(r =>
            React.createElement('li', { key: r.id }, `${r.id} (${r.lat}, ${r.lon})`)
          )
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
