import waterfall1 from "../assets/images/waterfall1.jpeg";
import waterfall2 from "../assets/images/waterfall2.jpeg";
import waterfall3 from "../assets/images/waterfall3.jpeg";

export const templesData = [
  {
    id: 1,
    name: "Sri Rama Temple",
    slug: "sri-rama-temple",
    shortDescription:
      "Ancient temple known for its spiritual importance and architecture.",
    description:
      "Sri Rama Temple is one of the prominent spiritual landmarks in Parvathipuram Manyam district. Devotees visit throughout the year, especially during festivals. The peaceful surroundings and traditional architecture reflect the region’s cultural heritage.",
    image: waterfall1,
    latitude: 18.4098,
    longitude: 83.2315,

    howToReach: {
      road: "Accessible by road from Parvathipuram town via buses and taxis.",
      rail: "Nearest railway station is Parvathipuram Railway Station (10 km).",
      air: "Nearest airport is Visakhapatnam International Airport (120 km).",
      distance: "10 km from Parvathipuram town",
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
