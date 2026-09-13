function CategoriesPage() {
  const categories = [
    { name: "Street Food", items: 18 },
    { name: "Japanese", items: 12 },
    { name: "Desserts", items: 9 },
    { name: "Healthy", items: 14 },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand">Leaf Village</div>
        <nav>
          <a href="/">Dashboard</a>
          <a href="/restaurants">Restaurants</a>
          <a href="/categories">Categories</a>
          <a href="/foods">Foods</a>
          <a href="/orders">Orders</a>
          <a href="/users">Users</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-kicker">Menu taxonomy</span>
            <h1>Categories</h1>
          </div>
          <button className="admin-primary-button">Add Category</button>
        </header>

        <div className="card-grid">
          {categories.map((category) => (
            <div key={category.name} className="admin-panel category-card-item">
              <h3>{category.name}</h3>
              <p>{category.items} menu items</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default CategoriesPage;
