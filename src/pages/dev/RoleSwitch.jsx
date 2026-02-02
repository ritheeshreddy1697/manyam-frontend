import { useNavigate } from "react-router-dom";

export default function RoleSwitch() {
  const navigate = useNavigate();

  const loginAs = (role) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "dev-id",
        name: role.toUpperCase(),
        role: role,
      })
    );

    localStorage.setItem("token", "dev-token");

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "hotel") {
      navigate("/hotel/dashboard");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="pt-32 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-3">
        <h2 className="text-xl font-bold text-center">UI Role Testing</h2>

        <button
          onClick={() => loginAs("user")}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Login as User
        </button>

        <button
          onClick={() => loginAs("admin")}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login as Admin
        </button>

        <button
          onClick={() => loginAs("hotel")}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Login as Hotel
        </button>

        <button
          onClick={logout}
          className="w-full bg-gray-300 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
