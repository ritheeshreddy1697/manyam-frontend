import { templesData } from "./templesData";
import { waterfallsData } from "./waterfallsData";
import { viewpointsData } from "./viewpointsData";
import { festivalsData } from "./festivalsData";
import { galleryData } from "./galleryData";

export const attractionCollections = {
  temples: templesData,
  waterfalls: waterfallsData,
  viewpoints: viewpointsData,
  festivals: festivalsData,
  gallery: galleryData,
};

export const attractionCategories = [
  {
    key: "temples",
    label: "Temples",
    detailBasePath: "/temples",
  },
  {
    key: "waterfalls",
    label: "Waterfalls",
    detailBasePath: "/waterfalls",
  },
  {
    key: "viewpoints",
    label: "Viewpoints",
    detailBasePath: "/viewpoints",
  },
  {
    key: "festivals",
    label: "Festivals",
    detailBasePath: "/festivals",
  },
  {
    key: "gallery",
    label: "Gallery",
    detailBasePath: "/gallery",
  },
];

export const getAttractionDetailPath = (category, slug) => {
  const matchedCategory = attractionCategories.find((item) => item.key === category);
  if (!matchedCategory) return "#";

  if (matchedCategory.key === "gallery") {
    return matchedCategory.detailBasePath || "#";
  }

  if (!slug) return "#";

  return `${matchedCategory.detailBasePath}/${slug}`;
};
