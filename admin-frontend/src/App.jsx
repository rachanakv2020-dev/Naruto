import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import RestaurantsPage from "./pages/RestaurantsPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import FoodsPage from "./pages/FoodsPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

const isAdminLoggedIn = () => Boolean(localStorage.getItem("leaf_admin_token"));

function App() {
  return (
    <Routes>
      <Route path="/login" element={isAdminLoggedIn() ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={isAdminLoggedIn() ? <DashboardPage /> : <Navigate to="/login" replace />} />
      <Route path="/restaurants" element={isAdminLoggedIn() ? <RestaurantsPage /> : <Navigate to="/login" replace />} />
      <Route path="/categories" element={isAdminLoggedIn() ? <CategoriesPage /> : <Navigate to="/login" replace />} />
      <Route path="/foods" element={isAdminLoggedIn() ? <FoodsPage /> : <Navigate to="/login" replace />} />
      <Route path="/orders" element={isAdminLoggedIn() ? <OrdersPage /> : <Navigate to="/login" replace />} />
      <Route path="/users" element={isAdminLoggedIn() ? <UsersPage /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={isAdminLoggedIn() ? <SettingsPage /> : <Navigate to="/login" replace />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error" replace />} />
    </Routes>
  );
}

export default App;
