import { useEffect, useState } from "react";
import api from "../services/api.js";

const emptyRestaurant = {
  name: "",
  slug: "",
  description: "",
  cuisine: "",
  delivery_time: "",
  delivery_fee: "0",
  image: "",
  is_active: true,
};

const navItems = ["Dashboard", "Restaurants", "Categories", "Foods", "Orders", "Users", "Settings"];

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(emptyRestaurant);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const loadRestaurants = async () => {
    const response = await api.get("/restaurants?limit=100&include_inactive=true");
    setRestaurants(response.data.items || []);
  };

  useEffect(() => {
    loadRestaurants().catch((requestError) => {
      setError(requestError.response?.data?.message || "Could not load restaurants.");
    });
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyRestaurant });
    setError("");
    setShowForm(true);
  };

  const openEdit = (restaurant) => {
    setEditingId(restaurant.id);
    setForm({ ...emptyRestaurant, ...restaurant });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`/restaurants/${editingId}`, form);
      else await api.post("/restaurants", form);
      setShowForm(false);
      await loadRestaurants();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save restaurant.");
    }
  };

  const toggleStatus = async (restaurant) => {
    try {
      await api.put(`/restaurants/${restaurant.id}`, { is_active: !restaurant.is_active });
      await loadRestaurants();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update restaurant status.");
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand">Leaf Village</div>
        <nav>{navItems.map((item) => <a key={item} href={item === "Dashboard" ? "/" : `/${item.toLowerCase()}`}>{item}</a>)}</nav>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-kicker">Restaurant management</span><h1>Restaurants</h1></div>
          <button className="admin-primary-button" onClick={openCreate}>Add Restaurant</button>
        </header>
        {error && <p className="admin-error-text">{error}</p>}
        {showForm && (
          <form className="admin-panel admin-form-grid" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit restaurant" : "Add restaurant"}</h2>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Restaurant name" required />
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" required />
            <input name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="Cuisine" />
            <input name="delivery_time" value={form.delivery_time} onChange={handleChange} placeholder="Delivery time" />
            <input name="delivery_fee" type="number" min="0" step="0.01" value={form.delivery_fee} onChange={handleChange} placeholder="Delivery fee" />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
            <label className="checkbox-label"><input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} /> Active</label>
            <div className="button-row"><button className="admin-primary-button" type="submit">Save</button><button className="mini-button" type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
          </form>
        )}
        <div className="data-table">
          <div className="table-head table-row"><span>Name</span><span>Cuisine</span><span>Status</span><span>Actions</span></div>
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="table-row">
              <span>{restaurant.name}</span><span>{restaurant.cuisine || "-"}</span>
              <span className={`tag ${restaurant.is_active ? "success" : "primary"}`}>{restaurant.is_active ? "Open" : "Closed"}</span>
              <span className="button-row"><button className="mini-button" onClick={() => openEdit(restaurant)}>Edit</button><button className="mini-button" onClick={() => toggleStatus(restaurant)}>{restaurant.is_active ? "Close" : "Open"}</button></span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RestaurantsPage;
