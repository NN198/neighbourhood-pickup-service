const { useState } = React;

function App() {
  const [shopperId, setShopperId] = useState('alice');
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [helper, setHelper] = useState({ id: '', lat: '', lon: '' });
  const [query, setQuery] = useState({ lat: '', lon: '', radius_km: 5 });
  const [nearby, setNearby] = useState([]);
  const [helpers, setHelpers] = useState([]);

  async function addItem() {
    await fetch(`/shoppers/${shopperId}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: itemName, quantity: parseInt(itemQty) }),
    });
    loadCart();
  }

  async function loadCart() {
    const resp = await fetch(`/shoppers/${shopperId}/cart`);
    const items = await resp.json();
    setCartItems(items);
  }

  async function registerHelper() {
    await fetch('/helpers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: helper.id,
        lat: parseFloat(helper.lat),
        lon: parseFloat(helper.lon),
      }),
    });
  }

  async function findNearby() {
    const params = new URLSearchParams({
      lat: query.lat,
      lon: query.lon,
      radius_km: query.radius_km,
    });
    const resp = await fetch(`/helpers/nearby?${params.toString()}`);
    const recs = await resp.json();
    setNearby(recs);
  }

  async function loadHelpers() {
    const resp = await fetch('/helpers');
    setHelpers(await resp.json());
  }

  async function seed() {
    await fetch('/seed', { method: 'POST' });
    await loadCart();
    await loadHelpers();
  }

  return (
    React.createElement('div', null,
      React.createElement('h1', null, 'Neighborhood Pickup Service'),

      React.createElement('button', { onClick: seed }, 'Seed Dummy Data'),

      React.createElement('section', null,
        React.createElement('h2', null, 'Cart'),
        React.createElement('input', {
          value: shopperId,
          onChange: e => setShopperId(e.target.value),
          placeholder: 'Shopper ID'
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
        React.createElement('h2', null, 'Register Helper'),
        React.createElement('input', {
          value: helper.id,
          onChange: e => setHelper({ ...helper, id: e.target.value }),
          placeholder: 'Helper ID'
        }),
        React.createElement('input', {
          value: helper.lat,
          onChange: e => setHelper({ ...helper, lat: e.target.value }),
          placeholder: 'Lat'
        }),
        React.createElement('input', {
          value: helper.lon,
          onChange: e => setHelper({ ...helper, lon: e.target.value }),
          placeholder: 'Lon'
        }),
        React.createElement('button', { onClick: registerHelper }, 'Register')
      ),

      React.createElement('section', null,
        React.createElement('h2', null, 'All Helpers'),
        React.createElement('button', { onClick: loadHelpers }, 'Load Helpers'),
        React.createElement('ul', null,
          helpers.map(h =>
            React.createElement('li', { key: h.id }, `${h.id} (${h.lat}, ${h.lon})`)
          )
        )
      ),

      React.createElement('section', null,
        React.createElement('h2', null, 'Nearby Helpers'),
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
