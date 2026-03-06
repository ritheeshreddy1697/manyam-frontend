import { useCallback, useEffect, useState } from "react";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../utils/apiUrl";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const finishBackendLogin = useCallback(async (user) => {
    const token = await user.getIdToken();
    const loginEmail = user.email?.trim().toLowerCase() || "";

    const loginUrl = buildApiUrl("/api/auth/google");
    if (!loginUrl) {
      throw new Error("Invalid API URL configuration");
    }

    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    const data = await res.json();

    if (!res.ok || !data?.token || !data?.role) {
      throw new Error(data?.msg || "Login failed. Please try again.");
    }

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
  }, [navigate]);

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
        alert(err?.message || "Login failed. Please try again.");
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
    } catch {
      alert("Login failed. Please try again.");
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
