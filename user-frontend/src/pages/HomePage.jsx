import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroBanner from "../components/HeroBanner.jsx";
import SearchBar from "../components/SearchBar.jsx";
import api from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [addedFoodId, setAddedFoodId] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = (food) => {
    addToCart(food);
    setAddedFoodId(food.id);
    window.setTimeout(() => setAddedFoodId(null), 1200);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, categoryRes, foodRes] = await Promise.all([
          api.get("/restaurants"),
          api.get("/categories"),
          api.get("/foods?featured=true"),
        ]);

        setRestaurants(restaurantRes.data.items || restaurantRes.data || []);
        setCategories(categoryRes.data || []);
        setFoods(foodRes.data || []);
      } catch (error) {
        console.error("Home page data failed:", error);
      }
    };

    fetchData();
  }, []);

  const filteredRestaurants = (restaurants || []).filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <HeroBanner />

      <section className="container section-space">
        <div className="section-header">
          <h2>Find your craving</h2>
          <Link to="/restaurants">View all</Link>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <section className="container section-space">
        <div className="section-header">
          <h2>Popular categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card glass-card">
              <span className="category-icon">🍜</span>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-space">
        <div className="section-header">
          <h2>Popular restaurants</h2>
        </div>
        <div className="restaurant-grid">
          {filteredRestaurants.slice(0, 4).map((restaurant) => (
            <motion.div key={restaurant.id} className="restaurant-card glass-card" whileHover={{ y: -5 }}>
              <img src={restaurant.image} alt={restaurant.name} />
              <div className="card-body">
                <div className="pill-row">
                  <span className="rating-pill">★ {restaurant.rating || 4.8}</span>
                  <span className="delivery-pill">{restaurant.delivery_time}</span>
                </div>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.cuisine}</p>
                <Link to={`/restaurants/${restaurant.id}`} className="inline-link">View menu</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container section-space">
        <div className="section-header">
          <h2>Popular foods</h2>
        </div>
        <div className="food-grid">
          {foods.slice(0, 6).map((food) => (
            <div key={food.id} className="food-card glass-card">
              <img src={food.image} alt={food.name} />
              <div className="card-body">
                <div className="food-topline">
                  <span>{food.category_name || "Featured"}</span>
                  <span>{food.spicy ? "🌶️" : "⭐"}</span>
                </div>
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
    </>
  );
}

export default HomePage;
