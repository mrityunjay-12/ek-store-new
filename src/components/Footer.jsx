import { LiaStoreAltSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const socialLinks = [
    { icon: "/logos/facebook.png", bg: "bg-blue-100", alt: "Facebook" },
    { icon: "/logos/x.png", bg: "bg-gray-100", alt: "X (Twitter)" },
    { icon: "/logos/insta.png", bg: "bg-pink-100", alt: "Instagram" },
    { icon: "/logos/snapchat.png", bg: "bg-yellow-100", alt: "Snapchat" },
    { icon: "/logos/pinterest.png", bg: "bg-red-100/20", alt: "Pinterest" },
    { icon: "/logos/whatsapp.png", bg: "bg-green-100", alt: "WhatsApp" },
  ];
  // change8

  return (
    <footer className="bg-white text-black pt-12">
      {/* Service Highlights */}
      <div className="max-w-screen-xl mx-auto mb-10 px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-gray-200">
        <div className="flex flex-col items-center text-center gap-2">
          <img src="/icons/shipping.png" alt="Free Shipping" className="h-14" />
          <p className="text-sm font-semibold">Free Shipping</p>
          <p className="text-xs text-gray-500">On orders above ₹999 within India</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <img src="/icons/returns.png" alt="Easy Returns" className="h-14" />
          <p className="text-sm font-semibold">Easy Returns</p>
          <p className="text-xs text-gray-500">Free returns within 7 days of delivery</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <img src="/icons/payment.png" alt="Secure Payments" className="h-14" />
          <p className="text-sm font-semibold">Secure Payments</p>
          <p className="text-xs text-gray-500">100% Payment Secure Checkout</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <img src="/icons/delivery.png" alt="Worldwide Delivery" className="h-14" />
          <p className="text-sm font-semibold">Worldwide Delivery</p>
          <p className="text-xs text-gray-500">Delivery around the globe</p>
        </div>
      </div>
      {/* Social Icons */}
      <div className="w-full flex flex-wrap justify-center gap-4 px-4 pb- mb-10">
        {socialLinks.map((item, idx) => (
          <div
            key={idx}
            className={`w-[150px] h-[65px] flex items-center justify-center rounded-sm border ${item.bg}`}
          >
            <img src={item.icon} alt={item.alt} className="h-6 w-6" />
          </div>
        ))}
        <button className="w-full md:w-auto h-[65px] flex items-center justify-center gap-2 px-6 md:px-20 border rounded-sm text-sm font-medium text-blue-600 hover:bg-blue-50 transition">
          <LiaStoreAltSolid className="text-lg " />
          Find Our Stores
        </button>
      </div>

      {/* Grid Section */}
      <div className="text-center md:text-left max-w-screen-xl mx-auto mb-20 px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-8">

        {/* Column 1 - Account + Products */}
        <div >
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="text-sm space-y-1 text-gray-700 mb-6">
            <li><Link to="/profile#">My Account</Link></li>
            <li><Link to="/profile?tab=orders">Check Order</Link></li>
          </ul>

          <h4 className="font-semibold mb-3">Products</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li><Link to="/products#">New In</Link></li>
            <li><Link to="/products?category=accessories#">Accessories</Link></li>
            <li><Link to="/products?category=kids-girls#">Girls</Link></li>
            <li><Link to="/products?categoryId=67dbce2c553ddd1f94fe1102#">Woman</Link></li>
          </ul>
        </div>

        {/* Column 2 - Company */}
        <div >
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/faq">Check Gift Card Balance</Link></li>
            <li><Link to="/faq">Return & Exchange</Link></li>
            <li><Link to="/faq">Terms of Use</Link></li>
            <li><Link to="/faq">Privacy Policy</Link></li>
            <li><Link to="/faq">Store Pickup</Link></li>
            <li><Link to="/faq">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Column 4 - Useful Links */}
        <div >
          <h4 className="font-semibold mb-3">Useful Links</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li><a href="#">Blog</a></li>
            <li><a href="#">Store Locator</a></li>
            <li><a href="#">Rise Rewards</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Career</a></li>
            <li><a href="#">Contact us</a></li>
          </ul>
        </div>

        {/* Column 5+6 - Newsletter (Double Width) */}
        <div className=" sm:col-span-2 md:col-span-2">
          <h4 className="font-semibold mb-3">Let's keep the conversation going!</h4>
          <form className="flex flex-col gap-2 mb-6">
            <Input type="email" placeholder="Enter Email Address" className="border" />
            <Button className="bg-black text-white hover:bg-gray-800">
              Sign up for our newsletter
            </Button>
          </form>
          <div>
            <h5 className="font-semibold mb-1">Download our apps</h5>
            <p className="text-sm text-gray-700 mb-2">
              Shop our products and offers on-the-go.
            </p>
            <div className="flex gap-2 rounded-lg">
              <img src="/appstore.png" alt="App Store" className="h-10 w-auto max-w-[30%] sm:max-w-none" />
              <img src="/googleplay.png" alt="Google Play" className="h-10 w-auto max-w-[30%] sm:max-w-none" />
              <img src="/appgallery.png" alt="App Gallery" className="h-10 w-auto max-w-[30%] sm:max-w-none" />

            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-200 py-4 bg-gray-100">
        © {new Date().getFullYear()} www.estylishkart.com. All rights reserved.
      </div>
    </footer>
  );
}
