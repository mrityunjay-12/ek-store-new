"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function LoyaltyTab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 👇 Desktop View: Slide-out Loyalty Card */}
      <div
        className={`
          fixed top-1/3 right-0 z-50 hidden sm:block
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-[90%] hover:translate-x-0"}
        `}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex items-stretch h-[230px]">
          {/* Loyalty Label */}
          <div className="bg-gradient-to-b from-yellow-300 to-yellow-500
            text-black font-bold text-s tracking-widest
            px-2 py-10 rounded-l-md shadow-md origin-bottom
            -mr-[2px] writing-vertical flex items-center justify-center h-full"
          >
            L O Y A L T Y
          </div>

          {/* Popout Card */}
          <Card className="w-[280px] max-w-[80vw] bg-white shadow-xl border rounded-md px-4 py-4 h-full">
            <CardContent className="p-0 h-full flex flex-col justify-between">
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
        </div>
      </div>

      {/* 👇 Mobile View: Coin Button at Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50 block sm:hidden">
        {!open ? (
          <button onClick={() => setOpen(true)}>
            <img
              src="/coin.png"
              alt="loyalty"
              className="w-14 h-14 drop-shadow-lg"
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
