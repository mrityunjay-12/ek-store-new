import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function CheckoutNav() {
  const { pathname } = useLocation();

  const getActiveStep = () => {
    if (pathname.includes("/cart")) return "cart";
    if (pathname.includes("/checkout")) return "checkout";
    if (pathname.includes("/payment")) return "payment";
    return "";
  };

  const activeStep = getActiveStep();

  const stepStyle = (step) =>
    `relative ${
      activeStep === step ? "text-green-600 font-bold" : "text-gray-500"
    }`;

  return (
    <div className="w-full border-b shadow-sm py-4 px-6 flex items-center justify-between bg-white">
      {/* Logo */}
      <img src="/logo.png" alt="Logo" className="h-8" />

      {/* Steps */}
      <div className="flex items-center gap-8 font-semibold text-sm tracking-widest">
        <div className={stepStyle("cart")}>
          CART
          {activeStep === "cart" && (
            <div className="absolute left-0 right-0 -bottom-1 h-[2px] bg-green-600" />
          )}
        </div>
        <div className="text-gray-400">------------</div>
        <div className={stepStyle("checkout")}>
          CHECKOUT
          {activeStep === "checkout" && (
            <div className="absolute left-0 right-0 -bottom-1 h-[2px] bg-green-600" />
          )}
        </div>
        <div className="text-gray-400">------------</div>
        <div className={stepStyle("payment")}>
          PAYMENT
          {activeStep === "payment" && (
            <div className="absolute left-0 right-0 -bottom-1 h-[2px] bg-green-600" />
          )}
        </div>
      </div>

      {/* 100% Secure */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <ShieldCheck className="w-5 h-5 text-teal-500" />
        <span className="tracking-widest">100% SECURE</span>
      </div>
    </div>
  );
}
