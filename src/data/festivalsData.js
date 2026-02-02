import waterfall1 from "../assets/images/waterfall1.jpeg";
import waterfall2 from "../assets/images/waterfall2.jpeg";
import waterfall3 from "../assets/images/waterfall3.jpeg";

export const festivalsData = [
  {
    id: 1,
    name: "Manyam Tribal Festival",
    slug: "manyam-tribal-festival",
    shortDescription:
      "A vibrant celebration of tribal culture, dance, and traditions.",
    description:
      "The Manyam Tribal Festival celebrates indigenous culture through traditional dance, music, rituals, and handicrafts. It attracts visitors interested in experiencing the rich tribal heritage of the region.",
    image: waterfall2,
    latitude: 18.4052,
    longitude: 83.2278,

    howToReach: {
      road: "Festival venues are well connected by road from Parvathipuram.",
      rail: "Nearest railway station is Parvathipuram Railway Station (8 km).",
      air: "Nearest airport is Visakhapatnam International Airport (120 km).",
      distance: "8 km from Parvathipuram town",
    },

    gallery: {
      photos: [waterfall1, waterfall2, waterfall3],
      videos: [
        {
          type: "youtube",
          url: "https://www.youtube.com/embed/u4BHCwQIK-g",
        },
      ],
    },
  },
];
