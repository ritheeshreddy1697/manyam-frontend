export default function PaymentLoader({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 text-center animate-scaleIn">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <h2 className="font-semibold text-lg">Processing Payment</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please don’t refresh or go back
        </p>
      </div>
    </div>
  );
}
