// src/data/waterfallsData.js

import waterfall1 from "../assets/images/waterfall1.jpeg";
import waterfall2 from "../assets/images/waterfall2.jpeg";
import waterfall3 from "../assets/images/waterfall3.jpeg";
import waterfall4 from "../assets/images/waterfall4.jpeg";

export const waterfallsData = [
  {
    id: 1,
    name: "Thatiguda Waterfalls",
    slug: "thatiguda-waterfalls",

    shortDescription:
      "A scenic waterfall surrounded by lush green forests and hill terrain.",

    description:
      "Thatiguda Waterfalls is one of the most picturesque natural attractions in Parvathipuram Manyam district. Surrounded by dense forests and rocky terrain, the waterfall offers a refreshing experience, especially during the monsoon and post-monsoon seasons. It is an ideal destination for nature lovers, photographers, and eco-tourists seeking peace and natural beauty.",

    image: waterfall1,

    latitude: 18.4072,
    longitude: 83.2294,

    howToReach: {
      road:
        "Thatiguda Waterfalls is accessible by road from Parvathipuram town. Visitors can hire taxis or use local bus services up to the nearest village, followed by a short walk.",
      rail:
        "The nearest railway station is Parvathipuram Railway Station, approximately 25 km away.",
      air:
        "The nearest airport is Visakhapatnam International Airport, approximately 120 km away.",
      distance: "25 km from Parvathipuram town",
    },

    gallery: {
      photos: [
        waterfall1,
        waterfall2,
        waterfall3,
        waterfall4,
      ],
      videos: [
        {
          type: "youtube",
          url: "https://www.youtube.com/embed/u4BHCwQIK-g"
        },
        // Example for local video (optional)
        // {
        //   type: "mp4",
        //   url: "/assets/videos/thatiguda.mp4",
        // },
      ],
    },
  },

  {
    id: 2,
    name: "Gummalakonda Waterfalls",
    slug: "gummalakonda-waterfalls",

    shortDescription:
      "A seasonal waterfall located amidst serene hill ranges.",

    description:
      "Gummalakonda Waterfalls is a seasonal waterfall nestled among the hill ranges of Parvathipuram Manyam. The location is known for its calm atmosphere and scenic surroundings. During the rainy season, the waterfall comes alive and attracts visitors looking for peaceful natural retreats away from urban areas.",

    image: waterfall2,

    latitude: 18.3651,
    longitude: 83.1857,

    howToReach: {
      road:
        "Accessible by road from Parvathipuram via local transport and taxis.",
      rail:
        "The nearest railway station is Parvathipuram Railway Station, around 30 km away.",
      air:
        "The nearest airport is Visakhapatnam International Airport, approximately 125 km away.",
      distance: "30 km from Parvathipuram town",
    },

    gallery: {
      photos: [
        waterfall2,
        waterfall3,
        waterfall4,
      ],
      videos: [],
    },
  },
];
