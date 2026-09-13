import { useEffect, useState } from "react";
import api from "../services/api.js";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my");
        setOrders(response.data || []);
      } catch (error) {
        console.error("Order fetch failed", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="container section-space">
      <div className="section-header">
        <h2>Your orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card empty-state">
          <p>No orders yet. Start your first food mission.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="glass-card order-card">
              <div className="order-head">
                <h3>Order #{order.id}</h3>
                <span className="status-pill">{order.status}</span>
              </div>
              <p>Restaurant: {order.restaurant_name || "Hidden Leaf Grill"}</p>
              <p>Total: ₹{Number(order.total_amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
