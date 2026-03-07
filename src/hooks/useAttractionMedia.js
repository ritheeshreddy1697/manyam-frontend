import { useEffect, useState } from "react";

import { buildApiUrl } from "../utils/apiUrl";
import { toAttractionMediaMap } from "../utils/attractionMedia";

export function useAttractionCategoryMedia(category) {
  const [mediaBySlug, setMediaBySlug] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMedia = async () => {
      const url = buildApiUrl("/api/attractions/media", { category });
      if (!url || !category) {
        if (isMounted) {
          setMediaBySlug({});
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch attraction media");

        const data = await response.json();
        if (!isMounted) return;
        setMediaBySlug(toAttractionMediaMap(data));
      } catch {
        if (!isMounted) return;
        setMediaBySlug({});
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMedia();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { mediaBySlug, loading };
}

export function useAttractionItemMedia(category, slug) {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMedia = async () => {
      const url = buildApiUrl("/api/attractions/media", { category, slug });
      if (!url || !category || !slug) {
        if (isMounted) {
          setMedia(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch attraction media");

        const data = await response.json();
        if (!isMounted) return;
        setMedia(data);
      } catch {
        if (!isMounted) return;
        setMedia(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMedia();

    return () => {
      isMounted = false;
    };
  }, [category, slug]);

  return { media, loading };
}
