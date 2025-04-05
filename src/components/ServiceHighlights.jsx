import { RefreshCw, Headphones, ShieldCheck } from "lucide-react"

const services = [
  {
    icon: <RefreshCw className="w-6 h-6 text-orange-500" />,
    title: "Easy Returns",
    desc: "Hassle-free 7-day returns on all orders.",
  },
  {
    icon: <Headphones className="w-6 h-6 text-orange-500" />,
    title: "24/7 Support",
    desc: "Dedicated fashion assistance around the clock.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-orange-500" />,
    title: "Secure Payments",
    desc: "Safe and trusted payment options.",
  },
]

export default function ServiceHighlights() {
  return (
    <section className="w-full bg-white py-12 px-4 md:px-8">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-gray-50 p-5 rounded-lg border hover:shadow-md transition"
          >
            <div className="flex-shrink-0">{service.icon}</div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{service.title}</h4>
              <p className="text-sm text-gray-600">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
