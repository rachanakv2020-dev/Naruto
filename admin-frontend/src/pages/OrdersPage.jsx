function OrdersPage() {
  const orders = [
    { id: "#1042", customer: "Naruto U.", total: "₹540", status: "Preparing" },
    { id: "#1043", customer: "Sakura H.", total: "₹720", status: "Out for delivery" },
    { id: "#1044", customer: "Sai T.", total: "₹360", status: "Delivered" },
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
            <span className="admin-kicker">Order tracking</span>
            <h1>Orders</h1>
          </div>
        </header>

        <div className="data-table">
          <div className="table-head table-row">
            <span>Order</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="table-row">
              <span>{order.id}</span>
              <span>{order.customer}</span>
              <span>{order.total}</span>
              <span className="tag primary">{order.status}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default OrdersPage;
