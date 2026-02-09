import { Link } from "react-router-dom";
import { attractionsData } from "../../data/attractionsData";

export default function Attractions() {
  return (
<section className="section-top pb-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10">
          🌍 Explore Attractions in Parvathipuram Manyam
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractionsData.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              style={{ animationDelay: `${index * 120}ms` }}
              className="group bg-white rounded-3xl overflow-hidden
                         shadow-md hover:shadow-2xl
                         transform hover:-translate-y-2
                         transition-all duration-300
                         animate-fade-up"
            >
              {/* IMAGE */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover
                             group-hover:scale-110
                             transition-transform duration-700"
                />

                {/* CATEGORY BADGE */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur
                                 px-3 py-1 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center pt-4 text-sm">
                  <span className="text-gray-500">📍 Manyam</span>
                  <span className="text-green-700 font-semibold group-hover:underline">
                    Explore →
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
