
const apiKey = 'YOUR_OPENROUTESERVICE_API_KEY'; // Replace with your actual API key

async function calculate() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;

  const geocode = async (postcode) => {
    const res = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${postcode}`);
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
  } catch (err) {
    document.getElementById('result').innerText = "Error: check postcodes.";
  }
}
