import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "manyamtourism@gmail.com",
    pass: "byqr eeos zdxl weqx" // 🔴 Gmail App Password
  }
});

// Verify once at startup
transporter.verify((err) => {
  if (err) console.log("❌ Mail server error:", err);
  else console.log("✅ Mail server ready");
});

export const sendReceiptMail = async (to, pdfBuffer) => {
  await transporter.sendMail({
    from: "Manyam Tourism <manyamtourism@gmail.com>",
    to,
    subject: "Booking Confirmed – Manyam Tourism",
    text: "Your booking is confirmed. Please find the receipt attached.",
    attachments: [
      {
        filename: "booking-receipt.pdf",
        content: pdfBuffer
      }
    ]
  });
};

