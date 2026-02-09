import festival1 from "../assets/images/festival1.jpeg";
import festival2 from "../assets/images/festival2.jpeg";
import festival3 from "../assets/images/festival1.jpeg";

export const festivalsData = [
  {
    id: 1,
    name: "World Adivasi Day",
    slug: "world-adivasi-day-seethampeta",
    shortDescription:
      "A global celebration honoring tribal culture, identity, and rights.",
    description:
      "World Adivasi Day is celebrated every year in August to recognize and honor the culture, traditions, and contributions of tribal communities. In Parvathipuram Manyam district, the celebrations are organized with cultural programs, tribal dances, and awareness events at ITDA Seethampeta.",
    image: festival1,
    location: "ITDA Seethampeta",
    latitude: 18.3996,
    longitude: 83.2291,
    howToReach: {
      road: "Buses and autos available from nearby towns.",
      rail: "Parvathipuram Railway Station – 5 km.",
      air: "Visakhapatnam Airport – 120 km.",
      distance: "5 km from Parvathipuram",
    },
    gallery: {
      photos: [festival1],
      videos: [
        {
          type: "youtube",
          id: "eShuzWPoHyM",
        },
      ],
    },
    bestTime: "August",
  },

  {
    id: 2,
    name: "Kandi Festival",
    slug: "kandi-festival",
    shortDescription:
      "A traditional tribal festival celebrated across tribal villages.",
    description:
      "Kandi Festival is one of the most important tribal festivals, celebrated with devotion, rituals, traditional music, and dance across tribal villages in Parvathipuram Manyam district. The festival reflects unity, gratitude to nature, and ancestral traditions.",
    image: festival2,
    location: "All Tribal Villages",
    latitude: 18.4502,
    longitude: 83.2156,
    howToReach: {
      road: "Accessible by road to respective tribal villages.",
      rail: "Parvathipuram Railway Station – 10 km.",
      air: "Visakhapatnam Airport – 125 km.",
      distance: "Various locations",
    },
    gallery: {
      photos: [festival2],
      videos: [
        {
          type: "youtube",
          id: "9d2hmlEJaNc",
        },
      ],
    },
    bestTime: "December",
  },

  {
    id: 3,
    name: "World Adivasi Day",
    slug: "world-adivasi-day-parvathipuram",
    shortDescription:
      "District-level tribal celebration at ITDA Parvathipuram.",
    description:
      "World Adivasi Day is also celebrated at ITDA Parvathipuram with district-level participation, cultural programs, and awareness activities highlighting tribal heritage and development initiatives.",
    image: festival3,
    location: "ITDA Parvathipuram",
    latitude: 18.3974,
    longitude: 83.2211,
    howToReach: {
      road: "Easily accessible by city buses and autos.",
      rail: "Parvathipuram Railway Station – 2 km.",
      air: "Visakhapatnam Airport – 120 km.",
      distance: "2 km from Parvathipuram",
    },
    gallery: {
      photos: [festival3],
      videos: [],
    },
    bestTime: "August",
  },
];
