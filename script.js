
const apiKey = '5b3ce3597851110001cf624816a1ea58e2424d06998cc3e936a8c442'; // Replace with your OpenRouteService API key

const map = L.map('map').setView([54.5, -3], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let routeLayer;

async function calculate() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;

  const geocode = async (location) => {
    const res = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(location)}`);
    const data = await res.json();
    return data.features[0].geometry.coordinates;
  };

  try {
    const coordsFrom = await geocode(from);
    const coordsTo = await geocode(to);

    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({
        coordinates: [coordsFrom, coordsTo]
      })
    });

    const data = await res.json();
    const distanceMeters = data.features[0].properties.summary.distance;
    const distanceMiles = (distanceMeters / 1609.34).toFixed(2);
    const pricePerMile = 1.2;
    const totalPrice = (distanceMiles * pricePerMile).toFixed(2);

    document.getElementById('result').innerText = `Distance: ${distanceMiles} miles\nPrice: £${totalPrice}`;

    if (routeLayer) map.removeLayer(routeLayer);
    routeLayer = L.geoJSON(data).addTo(map);
    map.fitBounds(routeLayer.getBounds());

  } catch (err) {
    document.getElementById('result').innerText = "Error: Could not calculate route. Check input.";
  }
}
