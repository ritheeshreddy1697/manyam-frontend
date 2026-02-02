import { useParams } from "react-router-dom";
import templeImg from "../../assets/images/temple1.jpeg";

export default function AttractionDetails() {
  // ✅ MUST come first
  const { category } = useParams();

  // ✅ Safe normalization
  const normalizedKey = category?.toLowerCase();

  const attractionData = {
    temples: {
      title: "Ancient Temples",
      description:
        "Parvathipuram Manyam is home to several ancient temples reflecting rich spiritual heritage, traditional architecture, and centuries-old rituals.",
    },
    waterfalls: {
      title: "Scenic Waterfalls",
      description:
        "Surrounded by dense forests and hills, the waterfalls of Manyam offer breathtaking views and peaceful natural beauty.",
    },
    tribal: {
      title: "Tribal Culture",
      description:
        "The district is known for vibrant tribal communities with unique traditions, festivals, crafts, and lifestyles.",
    },
    festivals: {
      title: "Festivals & Fairs",
      description:
        "Local festivals celebrate the cultural diversity of the region through traditional music, dance, and rituals.",
    },
    viewpoints: {
      title: "Hill Viewpoints",
      description:
        "Scenic viewpoints offer panoramic views of hills, valleys, and forests, ideal for nature lovers and photographers.",
    },
  };

  const data = attractionData[normalizedKey];

  if (!data) {
    return (
      <section className="pt-32 text-center">
        <h2 className="text-2xl font-bold text-gray-700">
          Attraction not found
        </h2>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
          {data.title}
        </h1>

        <img
          src={templeImg}
          alt={data.title}
          className="w-full h-80 object-cover rounded-xl mb-8"
        />

        <p className="text-gray-700 leading-relaxed text-lg">
          {data.description}
        </p>
      </div>
    </section>
  );
}
