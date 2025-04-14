import HelpBanner from "@/components/HelpBanner";
import React from "react";
import { FaTruck, FaExclamationCircle } from "react-icons/fa";
import { MdTrackChanges } from "react-icons/md";

const popularQuestions = [
  "WHAT’S YOUR RETURN & EXCHANGE POLICY?",
  "WHAT’S YOUR SHIPPING POLICY?",
  "HOW DO I RETURN MY ORDER?",
  "MY ORDER SAYS DELIVERED BUT I CAN’T FIND IT?",
  "HOW CAN I REDEEM MY ESTYLISHKART GIFT COUPON?",
  "CAN I CANCEL OR EDIT MY ORDER?",
];

const infoSections = [
  { title: "RETURN & EXCHANGE", desc: "Find out how to make a return online, go to a store or schedule a pick-up." },
  { title: "TRACKING & DELIVERY", desc: "Get more info on delivery, times and addresses." },
  { title: "ORDERS", desc: "Know more about the order and delivery process." },
  { title: "IN-STORE", desc: "Find out how to make a return online, go to a store or schedule a pick-up." },
  { title: "PAYMENTS", desc: "Get more info on delivery, times and addresses." },
  { title: "GIFT", desc: "Know more about the order and delivery process." },
  { title: "MY ACCOUNT", desc: "Find out how to make a return online, go to a store or schedule a pick-up." },
  { title: "WARRANTY", desc: "Get more info on delivery, times and addresses." },
  { title: "OTHER INFORMATION", desc: "Know more about the order and delivery process." },
];

export default function Faq() {
  return (
    <>
     <HelpBanner/>
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-">
   
      {/* Most Popular Questions */}
      <section>
        <h2 className="text-center text-xl font-bold mb-6">MOST POPULAR QUESTIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {popularQuestions.map((question, index) => (
            <button
              key={index}
              className="border px-4 py-2 text-sm text-left flex justify-between items-center rounded hover:bg-gray-100"
            >
              {question}
              <span className="text-xl ml-2">&gt;</span>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex justify-center gap-6 flex-wrap mt-10 mb-10">
        <div className="flex flex-col items-center gap-2 border p-4 rounded w-40 hover:shadow">
          <MdTrackChanges size={28} />
          <p className="text-sm font-medium">TRACK ORDER</p>
        </div>
        <div className="flex flex-col items-center gap-2 border p-4 rounded w-40 hover:shadow">
          <MdTrackChanges size={28} />
          <p className="text-sm font-medium">TRACK ORDER</p>
        </div>
        <div className="flex flex-col items-center gap-2 border p-4 rounded w-40 hover:shadow">
          <FaExclamationCircle size={24} />
          <p className="text-sm font-medium">REPORT ISSUE</p>
        </div>
      </section>

      {/* Get More Information */}
      <section>
        <h2 className="text-center text-xl font-bold mb-6">GET MORE INFORMATION</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {infoSections.map((item, index) => (
            <div key={index} className="border rounded overflow-hidden hover:shadow transition">
              <img
                src="girl.png"
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-md font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
