/* eslint-disable */

export const displayMap =(locations) => {
  // Center map roughly on first location
const [lng, lat] = locations[0].coordinates;
const map = L.map("map", { scrollWheelZoom: false }).setView([lat, lng], 8);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
}).addTo(map);

// Add markers
const bounds = [];

locations.forEach((loc) => {
  const [lng, lat] = loc.coordinates;

  // Use your custom .marker class from style.css
  const customIcon = L.divIcon({ className: "marker", iconSize: [32, 40] });

  L.marker([lat, lng], { icon: customIcon })
    .addTo(map)
    .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`);

  bounds.push([lat, lng]);
});

// Auto-fit map to show all points
  if (bounds.length) map.fitBounds(bounds, { padding: [50, 50] });
  
}