import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

function FoodDetailPage() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await api.get(`/foods/${id}`);
        setFood(response.data);
      } catch (error) {
        console.error("Food detail failed", error);
      }
    };

    fetchFood();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(food);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  if (!food) {
    return <div className="container section-space">Loading food details...</div>;
  }

  return (
    <section className="container section-space">
      <div className="product-detail glass-card">
        <img src={food.image} alt={food.name} />
        <div>
          <span className="eyebrow">{food.category_name || "Special dish"}</span>
          <h1>{food.name}</h1>
          <p>{food.description}</p>
          <div className="price-row large">
            <strong>₹{Number(food.price).toFixed(2)}</strong>
            <span>{food.spicy ? "Spicy" : "Mild"}</span>
          </div>

          <div className="button-row stack-row">
            <button className="primary-button" onClick={handleAddToCart} disabled={added}>
              {added ? "Added to cart" : "Add to cart"}
            </button>
            <Link to="/restaurants" className="secondary-button">Back to restaurants</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FoodDetailPage;
