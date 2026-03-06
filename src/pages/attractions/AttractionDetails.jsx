import { useParams, useNavigate } from "react-router-dom";
import { waterfallsData } from "../../data/waterfallsData";
import { viewpointsData } from "../../data/viewpointsData";
import { festivalsData } from "../../data/festivalsData";

const dataByType = {
  waterfalls: waterfallsData,
  viewpoints: viewpointsData,
  festivals: festivalsData,
};

const labelByType = {
  waterfalls: "Waterfall",
  viewpoints: "Viewpoint",
  festivals: "Festival",
};

export default function AttractionDetails({ type }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const data = dataByType[type] || [];
  const item = data.find((entry) => entry.slug === slug);

  if (!item) return <div className="pt-24 text-center">Not found</div>;

  const heroImages =
    item.gallery?.photos?.length > 0
      ? item.gallery.photos
      : [item.image].filter(Boolean);

  return (
    <section className="pt-16 pb-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            {item.name}
          </h1>
          <p className="text-gray-600 mt-1">
            📍 {item.location || "Parvathipuram Manyam District"}
          </p>
        </div>

        {heroImages[0] && (
          <div className="rounded-2xl overflow-hidden shadow">
            <img
              src={heroImages[0]}
              alt={item.name}
              className="w-full h-[280px] md:h-[420px] object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Info label="Category" value={labelByType[type] || "Attraction"} />
          <Info label="Best Time" value={item.bestTime || "Year-round"} />
          <Info label="Distance" value={item.howToReach?.distance || "N/A"} />
          <Info label="District" value="Manyam" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700 leading-relaxed">{item.description}</p>
        </div>

        {(item.latitude || item.longitude) && (
          <div className="rounded-2xl overflow-hidden shadow">
            <iframe
              title={item.name}
              src={`https://www.google.com/maps?q=${item.latitude},${item.longitude}&output=embed`}
              className="w-full h-72"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex gap-3">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border text-gray-800 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
          >
            Directions
          </a>
          <button
            onClick={() => navigate("/booking")}
            className="bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-green-800 transition"
          >
            Book Stay
          </button>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
