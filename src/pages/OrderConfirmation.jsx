import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderConfirmation() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-10">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Thank you for your order!
      </h1>
      <p className="text-gray-600 max-w-md mb-6">
        Your order has been placed successfully. We’ll send you a confirmation email and notify you when it ships.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-[#723248] text-white rounded hover:bg-[#5e1f38] transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
