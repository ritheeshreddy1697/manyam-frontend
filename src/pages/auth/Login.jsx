import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        }
      );

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      navigate("/");
    } catch (err) {
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