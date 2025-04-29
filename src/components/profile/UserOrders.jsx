import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const UserOrders = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://estylishkart.el.r.appspot.com/api/orders/user/${userId}`
      );
      const data = res.data?.data || [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;

    const filtered = orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      if (start && createdAt < start) return false;
      if (end && createdAt > end) return false;
      return true;
    });

    setFilteredOrders(filtered);
  }, [startDate, endDate, orders]);

  if (loading) return <p className="text-center py-8">Loading orders...</p>;

  return (
    <div className="space-y-8 relative">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#723248] mb-4">My Orders</h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="text-sm block mb-1 text-gray-600">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-sm block mb-1 text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center py-8 text-sm text-gray-600">
          No orders found for the selected date range.
        </p>
      ) : (
        <div className="space-y-6 overflow-y-auto h-[calc(100%-3.5rem)] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Order #: {order.order_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <span className="block text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded mb-1">
                    Order Status: {order.order_status}
                  </span>
                  <span className="block text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    Payment: {order.payment_status} ({order.payment_method})
                  </span>
                </div>
              </div>

              {/* Addresses */}
              <div className="text-sm mb-2">
                <p>
                  <strong>Shipping Address:</strong>{" "}
                  {order.shipping_address?.address_name},{" "}
                  {order.shipping_address?.street},{" "}
                  {order.shipping_address?.city},{" "}
                  {order.shipping_address?.state} -{" "}
                  {order.shipping_address?.phone_number}
                </p>
              </div>
              <div className="text-sm mb-3">
                <p>
                  <strong>Billing Address:</strong>{" "}
                  {order.billing_address?.address_name},{" "}
                  {order.billing_address?.street}, {order.billing_address?.city}
                  , {order.billing_address?.state} -{" "}
                  {order.billing_address?.phone_number}
                </p>
              </div>

              <p className="text-sm font-medium mb-4">
                Total Price: ₹{order.total_order_price}
              </p>

              {/* Product Cards */}
              <div className="space-y-4">
                {order.orderItem?.map((item) => {
                  const variant = item.variant_id;
                  const product = item.product_id;
                  // const discount =
                  //   variant.compare_price && variant.compare_price > variant.price
                  //     ? Math.round(
                  //         ((variant.compare_price - variant.price) /
                  //           variant.compare_price) *
                  //           100
                  //       )
                  //     : 0;

                  return (
                    <div
                      key={item._id}
                      className="flex gap-4 border rounded p-3 bg-gray-50 items-start"
                    >
                      <img
                        src={variant?.image}
                        alt={product?.product_name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 text-sm">
                        <p className="text-xs text-gray-500 mb-1">
                          {product?.product_type}
                        </p>
                        <h3 className="font-semibold text-gray-800">
                          {product?.product_name}
                        </h3>

                        <div className="flex items-center gap-1 mt-1">
                          <label>Qty:</label>
                          <span className="font-medium">{item.quantity}</span>
                        </div>

                        <div className="mt-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            ₹{variant.price}
                          </span>
                          {variant.compare_price > variant.price && (
                            <>
                              {/* <span className="ml-2 text-gray-500 line-through text-xs">
                                ₹{variant.compare_price}
                              </span> */}
                              {/* <span className="ml-2 text-green-600 text-xs font-semibold">
                                {discount}% OFF
                              </span> */}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
