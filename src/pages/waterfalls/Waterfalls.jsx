import { Link } from "react-router-dom";
import { waterfallsData } from "../../data/waterfallsData";

export default function Waterfalls() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-12">
          Waterfalls in Parvathipuram Manyam
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {waterfallsData.map((item) => (
            <Link
              key={item.id}
              to={`/waterfalls/${item.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.shortDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
