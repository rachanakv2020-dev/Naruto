import { useEffect, useState } from "react";
import api from "../services/api.js";

const emptyFood = { restaurant_id: "", category_id: "", name: "", description: "", price: "", stock_quantity: 0, image: "", is_available: true, spicy: false, featured: false };
const navItems = ["Dashboard", "Restaurants", "Categories", "Foods", "Orders", "Users", "Settings"];

function FoodsPage() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(emptyFood);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const loadFoods = async () => setFoods((await api.get("/foods?limit=100")).data || []);

  useEffect(() => {
    Promise.all([loadFoods(), api.get("/restaurants?limit=100&include_inactive=true")])
      .then(([, restaurantResponse]) => setRestaurants(restaurantResponse.data.items || []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Could not load food inventory."));
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyFood, restaurant_id: restaurants[0] ? String(restaurants[0].id) : "" });
    setShowForm(true);
  };

  const openEdit = (food) => {
    setEditingId(food.id);
    setForm({ ...emptyFood, ...food, restaurant_id: String(food.restaurant_id), category_id: food.category_id ? String(food.category_id) : "" });
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`/foods/${editingId}`, form);
      else await api.post("/foods", form);
      setShowForm(false);
      await loadFoods();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save food item.");
    }
  };

  const toggleAvailability = async (food) => {
    try {
      await api.put(`/foods/${food.id}`, { is_available: !food.is_available });
      await loadFoods();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update stock status.");
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar"><div className="brand">Leaf Village</div><nav>{navItems.map((item) => <a key={item} href={item === "Dashboard" ? "/" : `/${item.toLowerCase()}`}>{item}</a>)}</nav></aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><span className="admin-kicker">Food inventory</span><h1>Foods</h1></div><button className="admin-primary-button" onClick={openCreate}>Add Food</button></header>
        {error && <p className="admin-error-text">{error}</p>}
        {showForm && (
          <form className="admin-panel admin-form-grid" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit food item" : "Add food item"}</h2>
            <select name="restaurant_id" value={form.restaurant_id} onChange={handleChange} required><option value="">Select restaurant</option>{restaurants.map((restaurant) => <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>)}</select>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Food name" required />
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" required />
            <input name="stock_quantity" type="number" min="0" step="1" value={form.stock_quantity} onChange={handleChange} placeholder="Stock quantity" required />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
            <label className="checkbox-label"><input name="is_available" type="checkbox" checked={form.is_available} onChange={handleChange} /> In stock</label>
            <label className="checkbox-label"><input name="spicy" type="checkbox" checked={form.spicy} onChange={handleChange} /> Spicy</label>
            <div className="button-row"><button className="admin-primary-button" type="submit">Save</button><button className="mini-button" type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
          </form>
        )}
        <div className="data-table"><div className="table-head table-row"><span>Food</span><span>Restaurant</span><span>Price / stock</span><span>Actions</span></div>{foods.map((food) => <div key={food.id} className="table-row"><span>{food.name}</span><span>{food.restaurant_name || "-"}</span><span>₹{Number(food.price).toFixed(2)} / {food.stock_quantity} in stock</span><span className="button-row"><button className="mini-button" onClick={() => openEdit(food)}>Edit</button><button className="mini-button" onClick={() => toggleAvailability(food)}>{food.is_available ? "Out of stock" : "In stock"}</button></span></div>)}</div>
      </main>
    </div>
  );
}

export default FoodsPage;
