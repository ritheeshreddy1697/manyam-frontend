export const MAX_ATTRACTION_PHOTOS = 3;

const getPhotoUrl = (photo) => {
  if (typeof photo === "string") return photo;
  return photo?.url || "";
};

export const getAttractionPhotoUrls = (mediaDoc) =>
  (Array.isArray(mediaDoc?.photos) ? mediaDoc.photos : [])
    .map(getPhotoUrl)
    .filter(Boolean);

export const toAttractionMediaMap = (mediaDocs = []) =>
  (Array.isArray(mediaDocs) ? mediaDocs : []).reduce((accumulator, mediaDoc) => {
    if (!mediaDoc?.slug) return accumulator;
    accumulator[mediaDoc.slug] = mediaDoc;
    return accumulator;
  }, {});

export const mergeAttractionItem = (item, mediaDoc) => {
  if (!item) return item;

  const uploadedPhotos = getAttractionPhotoUrls(mediaDoc);
  if (uploadedPhotos.length === 0) return item;

  return {
    ...item,
    image: uploadedPhotos[0],
    gallery: {
      ...(item.gallery || {}),
      photos: uploadedPhotos,
      videos: Array.isArray(item.gallery?.videos) ? item.gallery.videos : [],
    },
  };
};
