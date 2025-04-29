"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function LoyaltyTab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* DESKTOP VIEW */}
      <div
        className={`fixed top-1/3 right-2 ${
          open ? "z-50" : "z-[150]"
        } hidden sm:flex items-stretch h-[230px] pointer-events-none`}
      >
        <div
          className={`relative flex transition-all duration-300 ease-in-out ${
            open
              ? "translate-x-0 pointer-events-auto"
              : "translate-x-[calc(100%_-_32px)]"
          }`}
        >
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="pointer-events-auto bg-gradient-to-b from-[#f3d067] to-[#a77c1d] text-black font-extrabold tracking-widest px-3 py-7 rounded-l-md shadow-md text-[16px] writing-vertical flex items-center justify-center cursor-pointer"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            L O Y A L T Y
          </div>

          {open && (
            <Card className="w-[300px] max-w-[80vw] bg-white shadow-xl border rounded-md px-3 py-4 h-full pointer-events-auto">
              <CardContent className="pr-3 h-full flex flex-col justify-between">
              <div className="flex justify-center mb-3">
                <img src="/coin.png" alt="coin" className="w-12 h-12" />
              </div>
              <h3 className="text-center text-lg font-bold text-yellow-600 mb-2">
                Loyalty Membership Pass
              </h3>
              <p className="text-sm text-center font-medium text-gray-700 mb-1">
                On Minimum Purchase of ₹2000, you'll get{" "}
                <span className="text-yellow-600 font-bold">2 Coins</span>
              </p>
              <p className="text-xs text-center text-gray-600 leading-tight">
                10 Coins = ₹1000 Discount Coupon
                <br />
                <span className="text-[10px] block mt-1">
                  (Min purchase ₹1000 • No Return Policy)
                </span>
              </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>




      {/* MOBILE VIEW */}
      <div className="fixed bottom-4 right-4 z-50 block sm:hidden">
        {!open ? (
          <button onClick={() => setOpen(true)}>
            <img
              src="/coin.png"
              alt="loyalty"
              className="w-14 h-14 drop-shadow-lg rounded-full"
            />
          </button>
        ) : (
          <Card className="w-[90vw] bg-white shadow-xl border rounded-md px-4 py-4">
            <CardContent className="p-0 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <img src="/coin.png" alt="coin" className="w-10 h-10" />
                <button
                  className="text-sm text-gray-500"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </div>
              <h3 className="text-center text-lg font-bold text-yellow-600 mb-2">
                Loyalty Membership Pass
              </h3>
              <p className="text-sm text-center font-medium text-gray-700 mb-1">
                On Minimum Purchase of ₹2000, you'll get{" "}
                <span className="text-yellow-600 font-bold">2 Coins</span>
              </p>
              <p className="text-xs text-center text-gray-600 leading-tight">
                10 Coins = ₹1000 Discount Coupon
                <br />
                <span className="text-[10px] block mt-1">
                  (Min purchase ₹1000 • No Return Policy)
                </span>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
