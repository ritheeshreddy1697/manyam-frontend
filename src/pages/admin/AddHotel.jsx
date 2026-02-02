import { useState } from "react";

export default function AddHotel() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const makeHotel = async () => {
    if (!email) {
      setMessage("Please enter email");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/make-hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Error");
        return;
      }

      setMessage(`✅ ${email} is now a HOTEL`);
      setEmail("");
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Add Hotel</h2>

      <input
        type="email"
        placeholder="Hotel owner email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button onClick={makeHotel} style={{ padding: 10, width: "100%" }}>
        Make Hotel
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
