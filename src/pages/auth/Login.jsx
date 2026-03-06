import { useCallback, useEffect, useState } from "react";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../utils/apiUrl";

const FALLBACK_API_BASE_URLS = [
  "https://manyam-tourism-backend-1.onrender.com",
];

const normalizeBaseUrl = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text.replace(/\/+$/, "");
  return `https://${text}`.replace(/\/+$/, "");
};

const formatAuthError = (err) => {
  const code = String(err?.code || "");
  if (code === "auth/popup-closed-by-user") return "Google sign-in was cancelled.";
  if (code === "auth/popup-blocked") return "Popup was blocked by browser. Please allow popups and retry.";
  if (code === "auth/unauthorized-domain") return "This domain is not authorized in Firebase Auth settings.";
  if (code === "auth/network-request-failed") return "Network error while contacting Google/Firebase.";
  if (code === "auth/invalid-api-key") return "Firebase API key is invalid.";
  return err?.message || "Login failed. Please try again.";
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getLoginApiUrls = useCallback(() => {
    const urls = [];
    const primary = buildApiUrl("/api/auth/google");
    if (primary) urls.push(primary);

    FALLBACK_API_BASE_URLS.forEach((base) => {
      const normalized = normalizeBaseUrl(base);
      if (!normalized) return;
      const candidate = `${normalized}/api/auth/google`;
      if (!urls.includes(candidate)) urls.push(candidate);
    });

    return urls;
  }, []);

  const loginToBackend = useCallback(async (firebaseToken) => {
    const urls = getLoginApiUrls();
    if (urls.length === 0) {
      throw new Error("Invalid API URL configuration");
    }

    let lastError = "Login API request failed";

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: firebaseToken })
        });

        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }

        if (res.ok && data?.token && data?.role) {
          return data;
        }

        const message = data?.msg || `Login API failed (${res.status})`;
        lastError = `${message} [${url}]`;
      } catch (error) {
        lastError = `${error?.message || "Network request failed"} [${url}]`;
      }
    }

    throw new Error(lastError);
  }, [getLoginApiUrls]);

  const finishBackendLogin = useCallback(async (user) => {
    const firebaseToken = await user.getIdToken();
    const loginEmail = user.email?.trim().toLowerCase() || "";
    const data = await loginToBackend(firebaseToken);

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: loginEmail,
        role: data.role,
      })
    );

    if (data.role === "admin") {
      navigate("/admin/dashboard");
    } else if (data.role === "hotel") {
      navigate("/hotel/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate, loginToBackend]);

  useEffect(() => {
    let active = true;

    const handleRedirectResult = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        if (!active) return;

        if (!result?.user) {
          setLoading(false);
          return;
        }

        await finishBackendLogin(result.user);
      } catch (err) {
        if (!active) return;
        alert(formatAuthError(err));
        setLoading(false);
      }
    };

    handleRedirectResult();

    return () => {
      active = false;
    };
  }, [finishBackendLogin]);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithRedirect(auth, provider);
    } catch (err) {
      alert(formatAuthError(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 text-center">
        {/* LOGO / TITLE */}
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Manyam Tourism
        </h1>
        <p className="text-gray-500 mb-8">
          Explore • Book • Experience
        </p>

        {/* LOGIN CARD */}
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Sign in to continue
          </h2>

          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3
                       border rounded-xl py-3 px-4
                       hover:bg-gray-50 transition
                       disabled:opacity-50"
          >
            {/* Google icon */}
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />

            <span className="font-medium text-gray-700">
              {loading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          <p className="text-xs text-gray-400 mt-4">
            By continuing, you agree to our terms & privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
