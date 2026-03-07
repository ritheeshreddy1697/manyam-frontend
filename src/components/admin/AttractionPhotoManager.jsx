import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  attractionCategories,
  attractionCollections,
  getAttractionDetailPath,
} from "../../data/attractionCollections";
import { buildApiUrl } from "../../utils/apiUrl";
import {
  MAX_ATTRACTION_PHOTOS,
  mergeAttractionItem,
} from "../../utils/attractionMedia";

const getMediaKey = (category, slug) => `${category}:${slug}`;

const toAdminMediaMap = (mediaDocs = []) =>
  (Array.isArray(mediaDocs) ? mediaDocs : []).reduce((accumulator, mediaDoc) => {
    if (!mediaDoc?.category || !mediaDoc?.slug) return accumulator;
    accumulator[getMediaKey(mediaDoc.category, mediaDoc.slug)] = mediaDoc;
    return accumulator;
  }, {});

export default function AttractionPhotoManager() {
  const [activeCategory, setActiveCategory] = useState(attractionCategories[0].key);
  const [mediaByKey, setMediaByKey] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAttractionMedia = async () => {
      const url = buildApiUrl("/api/attractions/media");
      if (!url) {
        if (isMounted) {
          setMediaByKey({});
          setLoading(false);
          setError("API URL is not configured.");
        }
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load attraction photos");

        const data = await response.json();
        if (!isMounted) return;
        setMediaByKey(toAdminMediaMap(data));
      } catch {
        if (!isMounted) return;
        setMediaByKey({});
        setError("Could not load attraction photos.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAttractionMedia();

    return () => {
      isMounted = false;
    };
  }, []);

  const items = attractionCollections[activeCategory] || [];

  const handleMediaUpdated = (mediaDoc) => {
    const key = getMediaKey(mediaDoc.category, mediaDoc.slug);

    setMediaByKey((current) => {
      const nextState = { ...current };

      if (!Array.isArray(mediaDoc.photos) || mediaDoc.photos.length === 0) {
        delete nextState[key];
        return nextState;
      }

      nextState[key] = mediaDoc;
      return nextState;
    });
  };

  return (
    <div className="soft-panel rounded-3xl border border-white/60 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200/75 bg-white/75">
        <h2 className="display-heading text-xl md:text-2xl font-semibold text-slate-800">
          Attraction Photo Manager
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Upload up to {MAX_ATTRACTION_PHOTOS} Cloudinary photos for each temple,
          waterfall, viewpoint, and festival.
        </p>
      </div>

      <div className="px-6 py-4 bg-white/70 border-b border-slate-200/75">
        <div className="flex flex-wrap gap-3">
          {attractionCategories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeCategory === category.key
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white/85">
        {error && (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {loading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-72 rounded-3xl bg-gradient-to-r from-slate-200/70 via-slate-100 to-slate-200/70 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {items.map((item) => (
              <AttractionPhotoCard
                key={item.slug}
                category={activeCategory}
                item={item}
                mediaDoc={mediaByKey[getMediaKey(activeCategory, item.slug)]}
                onMediaUpdated={handleMediaUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AttractionPhotoCard({ category, item, mediaDoc, onMediaUpdated }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setSelectedFiles([]);
    setMessage({ type: "", text: "" });
  }, [category, item.slug]);

  const currentPhotos = Array.isArray(mediaDoc?.photos) ? mediaDoc.photos : [];
  const mergedItem = mergeAttractionItem(item, mediaDoc);
  const remainingSlots = Math.max(MAX_ATTRACTION_PHOTOS - currentPhotos.length, 0);
  const fileNames = selectedFiles.map((file) => file.name).join(", ");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      setSelectedFiles([]);
      return;
    }

    if (files.length > remainingSlots) {
      setSelectedFiles([]);
      setMessage({
        type: "error",
        text:
          remainingSlots === 0
            ? `This item already has ${MAX_ATTRACTION_PHOTOS} photos. Remove one to upload more.`
            : `You can upload only ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"}.`,
      });
      event.target.value = "";
      return;
    }

    setMessage({ type: "", text: "" });
    setSelectedFiles(files);
  };

  const uploadPhotos = async () => {
    if (selectedFiles.length === 0) {
      setMessage({ type: "error", text: "Select at least one photo to upload." });
      return;
    }

    const url = buildApiUrl("/api/admin/attractions/media");
    if (!url) {
      setMessage({ type: "error", text: "API URL is not configured." });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Admin login is required." });
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("slug", item.slug);
    selectedFiles.forEach((file) => formData.append("photos", file));

    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage({
          type: "error",
          text: data?.msg || "Photo upload failed.",
        });
        return;
      }

      onMediaUpdated(data);
      setSelectedFiles([]);
      setMessage({ type: "success", text: "Photos uploaded successfully." });
    } catch {
      setMessage({ type: "error", text: "Photo upload failed." });
    } finally {
      setSubmitting(false);
    }
  };

  const removePhoto = async (publicId) => {
    const url = buildApiUrl("/api/admin/attractions/media");
    if (!url) {
      setMessage({ type: "error", text: "API URL is not configured." });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Admin login is required." });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          slug: item.slug,
          publicId,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage({
          type: "error",
          text: data?.msg || "Could not remove the photo.",
        });
        return;
      }

      onMediaUpdated({
        category,
        slug: item.slug,
        photos: Array.isArray(data.photos) ? data.photos : [],
      });
      setMessage({ type: "success", text: "Photo removed successfully." });
    } catch {
      setMessage({ type: "error", text: "Could not remove the photo." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={mergedItem.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/75">
            {category.slice(0, 1).toUpperCase()}
            {category.slice(1)}
          </p>
          <p className="text-base font-semibold text-white">{item.name}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-600">{item.location || "Manyam"}</p>
            <p className="mt-1 text-xs text-slate-500">
              {currentPhotos.length} / {MAX_ATTRACTION_PHOTOS} uploaded photos
            </p>
          </div>

          <Link
            to={getAttractionDetailPath(category, item.slug)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Open page
          </Link>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">Current Photos</p>

          {currentPhotos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
              No uploaded photos yet. Static image is still visible on the site.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {currentPhotos.map((photo) => (
                <div
                  key={photo.publicId}
                  className="relative overflow-hidden rounded-2xl border border-slate-200"
                >
                  <img
                    src={photo.url}
                    alt={item.name}
                    className="h-24 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.publicId)}
                    disabled={submitting}
                    className="absolute right-2 top-2 rounded-full bg-black/65 px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div>
            <label
              htmlFor={`${category}-${item.slug}-photos`}
              className="block text-sm font-semibold text-slate-800"
            >
              Upload Photos
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Select up to {remainingSlots} more photo{remainingSlots === 1 ? "" : "s"}.
            </p>
          </div>

          <input
            id={`${category}-${item.slug}-photos`}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={remainingSlots === 0 || submitting}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 disabled:cursor-not-allowed"
          />

          {fileNames && (
            <p className="text-xs text-slate-500 break-words">{fileNames}</p>
          )}

          <button
            type="button"
            onClick={uploadPhotos}
            disabled={selectedFiles.length === 0 || submitting}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-700 shadow-md shadow-emerald-700/25 hover:-translate-y-0.5 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Uploading..." : "Upload Photos"}
          </button>

          {message.text && (
            <p
              className={`text-sm ${
                message.type === "error" ? "text-rose-700" : "text-emerald-700"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
