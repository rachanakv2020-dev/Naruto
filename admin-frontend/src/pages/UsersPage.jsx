function UsersPage() {
  const users = [
    { name: "Naruto U.", email: "naruto@leafmail.com", plan: "VIP" },
    { name: "Sakura H.", email: "sakura@leafmail.com", plan: "Standard" },
    { name: "Kakashi S.", email: "kakashi@leafmail.com", plan: "Premium" },
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
            <span className="admin-kicker">Customer roster</span>
            <h1>Users</h1>
          </div>
        </header>

        <div className="data-table">
          <div className="table-head table-row">
            <span>Name</span>
            <span>Email</span>
            <span>Plan</span>
          </div>
          {users.map((user) => (
            <div key={user.email} className="table-row">
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span className="tag success">{user.plan}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default UsersPage;
