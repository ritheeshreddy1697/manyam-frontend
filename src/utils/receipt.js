import PDFDocument from "pdfkit";

export const generateReceipt = (booking, hotel) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const bufferApi = globalThis.Buffer;

        if (bufferApi?.concat) {
          resolve(bufferApi.concat(buffers));
          return;
        }

        const totalLength = buffers.reduce((sum, chunk) => sum + chunk.length, 0);
        const merged = new Uint8Array(totalLength);
        let offset = 0;

        buffers.forEach((chunk) => {
          merged.set(chunk, offset);
          offset += chunk.length;
        });

        resolve(merged);
      });

      doc.fontSize(22).text("Manyam Tourism", { align: "center" });
      doc.moveDown();

      doc.fontSize(16).text("Booking Confirmation", { align: "center" });
      doc.moveDown(2);

      doc.fontSize(12);
      doc.text(`Booking ID: ${booking._id}`);
      doc.text(`Hotel Name: ${hotel.name}`);
      doc.text(`Location: ${hotel.location}`);
      doc.text(`Check-in: ${booking.checkIn}`);
      doc.text(`Check-out: ${booking.checkOut}`);
      doc.text(`Payment ID: ${booking.paymentId}`);
      doc.text(`Status: PAID`);

      doc.moveDown(2);
      doc.text("Thank you for booking with Manyam Tourism!");

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
