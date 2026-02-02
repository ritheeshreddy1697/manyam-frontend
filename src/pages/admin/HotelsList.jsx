export default function Hotels() {
  const hotels = JSON.parse(localStorage.getItem("hotels")) || [];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Hotels</h2>

      {hotels.length === 0 && <p>No hotels added</p>}

      {hotels.map((h) => (
        <div key={h.id} className="border p-3 mb-2 rounded">
          <p><b>{h.name}</b></p>
          <p>{h.location}</p>
          <p className="text-sm text-gray-600">{h.ownerEmail}</p>
        </div>
      ))}
    </div>
  );
}
