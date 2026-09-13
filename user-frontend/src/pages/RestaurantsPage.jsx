import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import api from "../services/api.js";

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get("/restaurants");
        setRestaurants(response.data.items || response.data || []);
      } catch (error) {
        console.error("Restaurant fetch failed", error);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = useMemo(
    () =>
      restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(search.toLowerCase())
      ),
    [restaurants, search]
  );

  return (
    <section className="container section-space">
      <div className="section-header">
        <h2>All restaurants</h2>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <div className="restaurant-grid">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card glass-card">
            <img src={restaurant.image} alt={restaurant.name} />
            <div className="card-body">
              <div className="pill-row">
                <span className="rating-pill">★ {restaurant.rating}</span>
                <span className="delivery-pill">{restaurant.delivery_time}</span>
              </div>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.cuisine}</p>
              <div className="card-meta-row">
                <span>₹{restaurant.delivery_fee || 0} delivery</span>
                <Link to={`/restaurants/${restaurant.id}`} className="small-button">Open menu</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RestaurantsPage;
