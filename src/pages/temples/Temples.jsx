import { Link } from "react-router-dom";
import { templesData } from "../../data/templesData";

export default function Temples() {
  return (
    <section className="section-top pb-16 px-6 attractions-page-bg">

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10 animate-fade-in">
          🛕 Temples in Parvathipuram Manyam
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {templesData.map((item, index) => (
            <Link
              key={item.id}
              to={`/temples/${item.slug}`}
              className="group bg-white rounded-3xl overflow-hidden
                         shadow-md hover:shadow-2xl transition-all duration-300
                         animate-fade-in-up"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover
                             group-hover:scale-110 transition-transform duration-500"
                />

                {/* DISTANCE BADGE */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur
                                 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                  📏 {item.howToReach?.distance}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.shortDescription}
                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-3 text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    📍 Manyam
                  </span>

                  <span className="text-green-700 font-semibold group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
