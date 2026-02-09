import viewpoint1 from "../assets/images/viewpoint1.jpeg";
import viewpoint2 from "../assets/images/viewpoint1.jpeg";
import viewpoint3 from "../assets/images/viewpoint1.jpeg";

export const viewpointsData = [
  {
    id: 1,
    name: "Adali View Point",
    slug: "adali-view-point",
    shortDescription:
      "A scenic hilltop viewpoint offering panoramic landscapes.",
    description:
      "Adali View Point is a popular hilltop destination near Seethampeta. It offers breathtaking panoramic views of surrounding hills and forests and can be visited in all seasons.",
    image: viewpoint1,
    latitude: 18.4981,
    longitude: 83.2564,
    howToReach: {
      road: "Accessible by auto from Seethampeta.",
      rail: "Parvathipuram Railway Station – 25 km.",
      air: "Visakhapatnam Airport – 120 km.",
      distance: "15 km from Seethampeta",
    },
    gallery: {
      photos: [viewpoint1, viewpoint2],
      videos: [
        {
          type: "youtube",
          id: "DhltrwjLFS4",
        },
      ],
    },
    bestTime: "All seasons",
  },

  {
    id: 2,
    name: "Jagathipalli View Point",
    slug: "jagathipalli-view-point",
    shortDescription:
      "A calm viewpoint surrounded by hills and greenery.",
    description:
      "Jagathipalli View Point is known for its peaceful environment and scenic hill views. Ideal for nature lovers and photography enthusiasts.",
    image: viewpoint2,
    latitude: 18.4762,
    longitude: 83.2419,
    howToReach: {
      road: "Reachable by auto from Seethampeta.",
      rail: "Parvathipuram Railway Station – 28 km.",
      air: "Visakhapatnam Airport – 122 km.",
      distance: "18 km from Seethampeta",
    },
    gallery: {
      photos: [viewpoint2],
      videos: [
        {
          type: "youtube",
          id: "1YtGdgzH9Ng",
        },
      ],
    },
    bestTime: "All seasons",
  },

  {
    id: 3,
    name: "Polla View Point",
    slug: "polla-view-point",
    shortDescription:
      "A beautiful viewpoint with wide valley views.",
    description:
      "Polla View Point offers stunning valley and hill views and is best enjoyed during sunrise and sunset. Accessible and suitable for all visitors.",
    image: viewpoint3,
    latitude: 18.4897,
    longitude: 83.2193,
    howToReach: {
      road: "Accessible by auto from Seethampeta.",
      rail: "Parvathipuram Railway Station – 24 km.",
      air: "Visakhapatnam Airport – 120 km.",
      distance: "14 km from Seethampeta",
    },
    gallery: {
      photos: [viewpoint3],
      videos: [
        {
          type: "youtube",
          id: "YfPWpmrEbWc",
        },
      ],
    },
    bestTime: "All seasons",
  },
];
