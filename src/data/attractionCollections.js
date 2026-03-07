import { templesData } from "./templesData";
import { waterfallsData } from "./waterfallsData";
import { viewpointsData } from "./viewpointsData";
import { festivalsData } from "./festivalsData";

export const attractionCollections = {
  temples: templesData,
  waterfalls: waterfallsData,
  viewpoints: viewpointsData,
  festivals: festivalsData,
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
];

export const getAttractionDetailPath = (category, slug) => {
  const matchedCategory = attractionCategories.find((item) => item.key === category);
  if (!matchedCategory || !slug) return "#";
  return `${matchedCategory.detailBasePath}/${slug}`;
};
