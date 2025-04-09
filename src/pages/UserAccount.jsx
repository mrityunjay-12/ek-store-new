import AddressBook from "@/components/AddressBook";
import ProfileDetails from "@/components/ProfileDetail";
import { useState } from "react";

export default function UserAccount() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-10 flex gap-6">
      {/* Sidebar */}
      <div className="w-60 border-r pr-4 text-sm">
        <h2 className="text-2xl font-bold text-[#723248] mb-6">Account</h2>
        <div className="space-y-2">
          <button
            className={`block w-full text-left px-2 py-1 rounded ${
              activeTab === "profile"
                ? "bg-[#f7e8ed] text-[#723248] font-semibold"
                : "text-gray-700 hover:text-[#723248]"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Details
          </button>
          <button
            className={`block w-full text-left px-2 py-1 rounded ${
              activeTab === "orders"
                ? "bg-[#f7e8ed] text-[#723248] font-semibold"
                : "text-gray-700 hover:text-[#723248]"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders & Returns
          </button>
          <button
            className={`block w-full text-left px-2 py-1 rounded ${
              activeTab === "coupons"
                ? "bg-[#f7e8ed] text-[#723248] font-semibold"
                : "text-gray-700 hover:text-[#723248]"
            }`}
            onClick={() => setActiveTab("coupons")}
          >
            Coupons
          </button>
          <button
            className={`block w-full text-left px-2 py-1 rounded ${
              activeTab === "addresses"
                ? "bg-[#f7e8ed] text-[#723248] font-semibold"
                : "text-gray-700 hover:text-[#723248]"
            }`}
            onClick={() => setActiveTab("addresses")}
          >
            Addresses
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === "profile" && <ProfileDetails />}
        {activeTab === "orders" && (
          <div className="text-gray-600">Coming soon: Order History</div>
        )}
        {activeTab === "coupons" && (
          <div className="text-gray-600">Coming soon: Coupons</div>
        )}
        {activeTab === "addresses" && <AddressBook />}
      </div>
    </div>
  );
}
