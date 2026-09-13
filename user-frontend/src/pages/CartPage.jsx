import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function CartPage() {
  const { cart, subtotal, updateQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <section className="container section-space text-center">
        <h1>Your cart is empty</h1>
        <p>Explore the Hidden Leaf menu and add your favorite dishes.</p>
        <Link to="/restaurants" className="primary-button">Browse restaurants</Link>
      </section>
    );
  }

  return (
    <section className="container section-space">
      <div className="section-header">
        <h2>Your cart</h2>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item glass-card">
              <img src={item.image} alt={item.name} />
              <div className="cart-item__details">
                <h3>{item.name}</h3>
                <p>₹{Number(item.price).toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
              <button className="link-button" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>

        <aside className="checkout-summary glass-card">
          <h3>Order summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>₹30.00</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>₹{(subtotal + 30).toFixed(2)}</strong>
          </div>

          <Link to="/checkout" className="primary-button width-full">Proceed to checkout</Link>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
