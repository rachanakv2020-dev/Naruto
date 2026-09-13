import { Link } from "react-router-dom";

const metrics = [
  { title: "Total Users", value: "1,248", tone: "orange" },
  { title: "Total Restaurants", value: "32", tone: "blue" },
  { title: "Total Foods", value: "180", tone: "green" },
  { title: "Pending Orders", value: "18", tone: "yellow" },
  { title: "Completed Orders", value: "824", tone: "orange" },
  { title: "Revenue", value: "₹1,42,500", tone: "green" },
];

function DashboardPage() {
  return (
    <div className="admin-dashboard-shell">
      <aside className="admin-sidebar">
        <div className="brand">Leaf Village</div>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/foods">Foods</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/users">Users</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("leaf_admin_token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-kicker">Operations dashboard</span>
            <h1>Village Overview</h1>
          </div>
        </header>

        <section className="stats-grid">
          {metrics.map((metric) => (
            <div key={metric.title} className={`stat-card ${metric.tone}`}>
              <small>{metric.title}</small>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </section>

        <section className="panel-grid">
          <div className="admin-panel">
            <h3>Monthly Orders</h3>
            <div className="chart-bars">
              {[42, 55, 48, 70, 80, 92, 85].map((value, index) => (
                <div key={index} className="bar-wrapper">
                  <span style={{ height: `${value}%` }}></span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-panel">
            <h3>Top Foods</h3>
            <ul className="rank-list">
              <li>Ramen Sensei Bowl</li>
              <li>Leaf Village Burger</li>
              <li>Sakura Sushi Combo</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
