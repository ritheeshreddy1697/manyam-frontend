import { Link } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { attractionsData } from "../../data/attractionsData";

export default function Attractions() {
  const [ref, visible] = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`pt-20 pb-20 px-6 bg-gray-50
        ${visible ? "scroll-show" : "scroll-hidden"}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-3">
            All Attractions
          </h1>
          <div className="w-16 h-1 bg-green-600 mx-auto"></div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {attractionsData.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              style={{ transitionDelay: `${index * 100}ms` }}
              className={`group relative block rounded-2xl overflow-hidden bg-white
                transform transition-all duration-700
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                group-hover:-translate-y-2 group-hover:shadow-2xl
              `}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500"></div>

                {/* Category */}
                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full z-10
                  transform transition-all duration-500
                  group-hover:-translate-y-1 group-hover:scale-105">
                  {item.category}
                </span>

                {/* CTA */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-white font-semibold
                    opacity-0 translate-y-4
                    transition-all duration-500
                    group-hover:opacity-100 group-hover:translate-y-0">
                    View Details →
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
