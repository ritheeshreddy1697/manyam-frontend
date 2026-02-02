// Import all images from ONE folder
import temple from "../assets/images/temple1.jpeg";
import waterfall from "../assets/images/temple1.jpeg";
import scenery from "../assets/images/temple1.jpeg";
import tribal from "../assets/images/temple1.jpeg";

import g1 from "../assets/images/temple1.jpeg";
import g2 from "../assets/images/temple1.jpeg";
import g3 from "../assets/images/temple1.jpeg";
import g4 from "../assets/images/temple1.jpeg";

// Top Attractions (dynamic)
export const attractions = [
  {
    title: "Temples",
    image: temple,
    route: "/attractions/temples",
  },
  {
    title: "Waterfalls",
    image: waterfall,
    route: "/attractions/waterfalls",
  },
  {
    title: "Sceneries",
    image: scenery,
    route: "/attractions/sceneries",
  },
  {
    title: "Tribal Culture",
    image: tribal,
    route: "/attractions/tribal",
  },
];

// Gallery images
export const galleryImages = [g1, g2, g3, g4];
