import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: "", city: "", state: "", postal_code: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const orderPayload = {
        restaurant_id: 1,
        address_id: 1,
        notes: "Delivery requested",
        items: cart.map((item) => ({ food_id: item.id, quantity: item.quantity })),
      };

      await api.post("/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed.");
    }
  };

  return (
    <section className="container section-space">
      <div className="checkout-grid">
        <div className="glass-card checkout-form">
          <h2>Delivery details</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Street
              <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
            </label>
            <label>
              City
              <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
            </label>
            <label>
              State
              <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
            </label>
            <label>
              Postal code
              <input value={address.postal_code} onChange={(e) => setAddress({ ...address, postal_code: e.target.value })} required />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="primary-button width-full" type="submit">Place order</button>
          </form>
        </div>

        <aside className="glass-card checkout-summary">
          <h3>Checkout summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="summary-row">
              <span>
                {item.name} x {item.quantity}
              </span>
              <strong>₹{(Number(item.price) * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <strong>₹{(subtotal + 30).toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
