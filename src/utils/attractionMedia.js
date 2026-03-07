export const MAX_ATTRACTION_PHOTOS = 3;
export const DEFAULT_ATTRACTION_FOCUS = 50;

const clampAttractionFocus = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return DEFAULT_ATTRACTION_FOCUS;
  return Math.min(100, Math.max(0, Math.round(numericValue)));
};

export const normalizeAttractionPhoto = (photo) => {
  if (typeof photo === "string") {
    const url = photo.trim();
    if (!url) return null;

    return {
      url,
      focusX: DEFAULT_ATTRACTION_FOCUS,
      focusY: DEFAULT_ATTRACTION_FOCUS,
    };
  }

  if (!photo?.url) return null;

  return {
    ...photo,
    focusX: clampAttractionFocus(photo.focusX),
    focusY: clampAttractionFocus(photo.focusY),
  };
};

export const getAttractionPhotoUrl = (photo) =>
  normalizeAttractionPhoto(photo)?.url || "";

export const getAttractionPhotoStyle = (photo) => {
  const normalizedPhoto = normalizeAttractionPhoto(photo);
  if (!normalizedPhoto) return undefined;

  return {
    objectPosition: `${normalizedPhoto.focusX}% ${normalizedPhoto.focusY}%`,
  };
};

const normalizeAttractionPhotoList = (photos = []) =>
  (Array.isArray(photos) ? photos : [])
    .map(normalizeAttractionPhoto)
    .filter(Boolean);

export const getAttractionPhotos = (mediaDoc) =>
  normalizeAttractionPhotoList(mediaDoc?.photos);

export const toAttractionMediaMap = (mediaDocs = []) =>
  (Array.isArray(mediaDocs) ? mediaDocs : []).reduce((accumulator, mediaDoc) => {
    if (!mediaDoc?.slug) return accumulator;
    accumulator[mediaDoc.slug] = mediaDoc;
    return accumulator;
  }, {});

export const mergeAttractionItem = (item, mediaDoc) => {
  if (!item) return item;

  const uploadedPhotos = getAttractionPhotos(mediaDoc);
  const fallbackGalleryPhotos = normalizeAttractionPhotoList(item.gallery?.photos);
  const primaryPhoto =
    uploadedPhotos[0] ||
    normalizeAttractionPhoto(item.image) ||
    fallbackGalleryPhotos[0] ||
    null;
  const galleryPhotos =
    uploadedPhotos.length > 0 ? uploadedPhotos : fallbackGalleryPhotos;

  return {
    ...item,
    image: getAttractionPhotoUrl(primaryPhoto),
    coverPhoto: primaryPhoto,
    gallery: {
      ...(item.gallery || {}),
      photos: galleryPhotos,
      videos: Array.isArray(item.gallery?.videos) ? item.gallery.videos : [],
    },
  };
};
