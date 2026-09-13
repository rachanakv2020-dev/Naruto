function SettingsPage() {
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
            <span className="admin-kicker">Configuration</span>
            <h1>Settings</h1>
          </div>
        </header>

        <div className="admin-panel settings-panel">
          <h3>Business preferences</h3>
          <div className="setting-lines">
            <div><strong>Delivery fee:</strong> ₹40</div>
            <div><strong>Minimum order:</strong> ₹149</div>
            <div><strong>Timezone:</strong> Asia/Kolkata</div>
            <div><strong>Auto-accept orders:</strong> On</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
