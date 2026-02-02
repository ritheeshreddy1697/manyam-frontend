import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const googleLogin = async () => {
    try {
      // 1️⃣ Google popup
      const result = await signInWithPopup(auth, provider);

      // 2️⃣ Get Google ID token
      const googleToken = await result.user.getIdToken();

      // 3️⃣ Send token to backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken })
      });

      if (!res.ok) throw new Error("Backend auth failed");

      const data = await res.json();

      // 4️⃣ Store JWT
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // 5️⃣ Redirect by role
      navigate(`/${data.role}/dashboard`);

    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <button
        onClick={googleLogin}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
