import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <section className="section-top pb-16 px-6 bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 space-y-14">

        {/* ===== HEADER ===== */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700">
            📞 Contact Manyam Tourism
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Need help planning your visit to Parvathipuram Manyam?
            Contact us or book your stay near top attractions.
          </p>
        </div>

        {/* ===== CONTENT GRID ===== */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* ===== CONTACT CARD ===== */}
          <div className="bg-white rounded-3xl shadow p-8 space-y-6">
            <h2 className="text-xl font-semibold">Tourism Office</h2>

            <div className="space-y-3 text-gray-700">
              <p><b>Department:</b> District Tourism Office</p>
              <p><b>District:</b> Parvathipuram Manyam</p>
              <p><b>Email:</b> tourism.manyam@ap.gov.in</p>
              <p><b>Phone:</b> +91 9XXXXXXXXX</p>
              <p><b>Office Hours:</b> 10:00 AM – 5:00 PM</p>
            </div>

            {/* CTA BUTTON */}
            <button
              onClick={() => navigate("/booking")}
              className="w-full mt-6 backdrop-blur-md
                         bg-green-700/80 text-white
                         py-4 rounded-xl font-semibold text-lg
                         shadow-lg hover:bg-green-800 transition
                         btn-float"
            >
              🏨 Book Your Stay Now
            </button>
          </div>

          {/* ===== MAP + QUICK ACTIONS ===== */}
          <div className="space-y-6">

            {/* MAP */}
            <div className="rounded-3xl overflow-hidden shadow">
              <iframe
                title="Parvathipuram Manyam"
                src="https://www.google.com/maps?q=Parvathipuram&t=k&z=13&output=embed"
                className="w-full h-72"
                loading="lazy"
              />
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-3xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:tourism.manyam@ap.gov.in"
                className="text-center py-3 rounded-xl
                           border border-green-700 text-green-700
                           font-semibold hover:bg-green-50 transition"
              >
                ✉️ Email Us
              </a>

              <button
                onClick={() => navigate("/booking")}
                className="text-center py-3 rounded-xl
                           bg-green-700 text-white
                           font-semibold hover:bg-green-800 transition"
              >
                🏨 Find Hotels
              </button>
            </div>
          </div>
        </div>

        {/* ===== FOOT NOTE ===== */}
        <div className="text-center text-sm text-gray-500">
          © Parvathipuram Manyam Tourism | Government of Andhra Pradesh
        </div>

      </div>
    </section>
  );
}
