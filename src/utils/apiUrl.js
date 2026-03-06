const RAW_API_BASE_URL = String(import.meta.env.VITE_API_URL || "").trim();

const normalizeApiBaseUrl = (baseUrl) => {
  if (!baseUrl) return "";
  if (/^https?:\/\//i.test(baseUrl)) return baseUrl;
  return `https://${baseUrl}`;
};

export const buildApiUrl = (path, query = null) => {
  try {
    const normalizedBase = normalizeApiBaseUrl(RAW_API_BASE_URL);
    if (!normalizedBase) return "";

    const baseWithSlash = normalizedBase.endsWith("/") ? normalizedBase : `${normalizedBase}/`;
    const url = new URL(String(path || "").replace(/^\/+/, ""), baseWithSlash);

    if (query && typeof query === "object") {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        url.searchParams.set(key, String(value));
      });
    }

    return url.toString();
  } catch {
    return "";
  }
};

