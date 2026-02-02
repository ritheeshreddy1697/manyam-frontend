import { Link } from "react-router-dom";
import { festivalsData } from "../../data/festivalsData";

export default function Festivals() {
  return (
    <section className="pt-28 pb-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-12">
          Festivals of Parvathipuram Manyam
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {festivalsData.map((item) => (
            <Link
              key={item.id}
              to={`/festivals/${item.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <img
                src={item.image}
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold">{item.name}</h3>
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
