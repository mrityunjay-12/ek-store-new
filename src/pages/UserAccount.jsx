import AddressBook from "@/components/profile/AddressBook";
import CouponList from "@/components/profile/CouponList";
import ProfileDetails from "@/components/ProfileDetail";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserOrders from "@/components/profile/UserOrders";

export default function UserAccount() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState(currentTab);

  // 🔁 Update tab when URL query changes
  useEffect(() => {
    setActiveTab(currentTab);
  }, [location.search]);

  const tabs = [
    { key: "profile", label: "Profile Details" },
    { key: "orders", label: "Orders & Returns" },
    { key: "coupons", label: "Coupons" },
    { key: "addresses", label: "Addresses" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-10 flex flex-col md:flex-row gap-6">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-60 border-r pr-4 text-sm">
        <h2 className="text-2xl font-bold text-[#723248] mb-6">Account</h2>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === tab.key
                  ? "bg-[#f7e8ed] text-[#723248] font-semibold"
                  : "text-gray-700 hover:text-[#723248]"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden mb-4">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm"
        >
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === "profile" && <ProfileDetails />}
        {activeTab === "orders" && <UserOrders />}
        {activeTab === "coupons" && <CouponList />}
        {activeTab === "addresses" && <AddressBook />}
      </div>
    </div>
  );
}
