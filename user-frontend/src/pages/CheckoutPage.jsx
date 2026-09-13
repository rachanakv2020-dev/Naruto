import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

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

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      const orderPayload = {
        restaurant_id: 1,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
        },
        notes: "Delivery requested",
        items: cart.map((item) => ({ food_id: item.id, quantity: item.quantity })),
      };

      const response = await api.post("/orders/checkout", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout failed to load.");
      }

      const razorpayOptions = {
        key: response.data.razorpay.key,
        amount: response.data.razorpay.amount,
        currency: response.data.razorpay.currency,
        name: "Naruto Food Delivery",
        description: "Food order payment",
        order_id: response.data.razorpay.orderId,
        handler: async function (paymentResponse) {
          await api.post(
            "/orders/verify-payment",
            {
              order_id: response.data.order.id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          clearCart();
          navigate("/orders");
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#4caf50",
        },
      };

      const razorpayInstance = new window.Razorpay(razorpayOptions);
      razorpayInstance.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Checkout failed.");
    }
  };

  return (
    <section className="container section-space checkout-page">
      <div className="checkout-grid">
        <div className="checkout-form glass-card">
          <h2>Delivery details</h2>
          <form onSubmit={handleSubmit}>
            <div className="checkout-row">
              <label className="field-group field-group--wide">
                <span>Street</span>
                <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="344,sgl ladies pg ,b block" required />
              </label>
              <label className="field-group">
                <span>City</span>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Bengaluru" required />
              </label>
            </div>

            <div className="checkout-row">
              <label className="field-group">
                <span>State</span>
                <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="Karnataka" required />
              </label>
              <label className="field-group">
                <span>Postal code</span>
                <input value={address.postal_code} onChange={(e) => setAddress({ ...address, postal_code: e.target.value })} placeholder="560037" required />
              </label>
            </div>

            {error && <p className="error-text">{error}</p>}
            <button className="primary-button checkout-submit" type="submit">Place order</button>
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
