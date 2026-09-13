import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

function RestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const { addToCart } = useCart();
  const [addedFoodId, setAddedFoodId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, foodRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/foods?restaurant_id=${id}`),
        ]);

        setRestaurant(restaurantRes.data);
        setFoods(foodRes.data || []);
      } catch (error) {
        console.error("Restaurant detail failed", error);
      }
    };

    fetchData();
  }, [id]);

  if (!restaurant) {
    return <div className="container section-space">Loading restaurant...</div>;
  }

  return (
    <section className="container section-space">
      <div className="restaurant-detail glass-card">
        <img src={restaurant.image} alt={restaurant.name} />
        <div>
          <span className="eyebrow">{restaurant.cuisine}</span>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="pill-row">
            <span className="rating-pill">★ {restaurant.rating}</span>
            <span className="delivery-pill">{restaurant.delivery_time}</span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>Menu</h2>
      </div>

      <div className="food-grid">
        {foods.map((food) => (
          <div key={food.id} className="food-card glass-card">
            <img src={food.image} alt={food.name} />
            <div className="card-body">
              <h3>{food.name}</h3>
              <p>{food.description}</p>
              <div className="price-row">
                <strong>₹{Number(food.price).toFixed(2)}</strong>
                <div className="button-row">
                  <Link to={`/foods/${food.id}`} className="small-button">Details</Link>
                  <button className="primary-button" onClick={() => handleAddToCart(food)} disabled={addedFoodId === food.id}>
                    {addedFoodId === food.id ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RestaurantDetailPage;
